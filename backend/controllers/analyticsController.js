import Analytics, { PageView, PostAnalytics } from '../models/Analytics.js';

export const trackView = async (req, res) => {
  const { postId } = req.body;
  const today = new Date();
  await Analytics.updateOne(
    { postId, date: today },
    { $inc: { views: 1 } },
    { upsert: true }
  );
  res.sendStatus(200);
};

export const getViews = async (req, res) => {
  const views = await Analytics.find({ postId: req.params.id });
  res.json(views);
};

export const trackPageView = async (req, res) => {
  try {
    const { page, postId, userAgent, referrer, sessionId } = req.body;
    
    if (!page || !userAgent || !sessionId) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: page, userAgent, sessionId' 
      });
    }

    const pageView = new PageView({
      page,
      postId: postId || null,
      sessionId,
      userAgent,
      referrer: referrer || null,
      ipAddress: getClientIP(req),
      deviceType: getDeviceType(userAgent),
      operatingSystem: getOperatingSystem(userAgent),
      timestamp: new Date()
    });

    await pageView.save();

    if (postId) {
      await updatePostAnalytics(postId, sessionId);
    }

    res.status(200).json({ success: true, id: pageView._id });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const days = getDaysFromPeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalViews,
      uniqueVisitors,
      mostReadPosts,
      deviceBreakdown,
      osBreakdown,
      dailyViews
    ] = await Promise.all([
      getTotalViews(startDate),
      getUniqueVisitors(startDate),
      getMostReadPosts(startDate, 5),
      getDeviceBreakdown(startDate),
      getOSBreakdown(startDate),
      getDailyViews(startDate, days)
    ]);

    const analyticsData = {
      totalViews,
      uniqueVisitors,
      mostReadPosts,
      deviceBreakdown,
      osBreakdown,
      dailyViews
    };

    res.json(analyticsData);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dados de analytics' });
  }
};

export const getPostAnalytics = async (req, res) => {
  try {
    const { postId } = req.params;
    const { period = '30d' } = req.query;
    
    const days = getDaysFromPeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalViews, uniqueViews, dailyViews] = await Promise.all([
      PageView.countDocuments({ 
        postId, 
        timestamp: { $gte: startDate } 
      }),
      PageView.distinct('sessionId', { 
        postId, 
        timestamp: { $gte: startDate } 
      }).then(sessions => sessions.length),
      getPostDailyViews(postId, startDate, days)
    ]);

    res.json({
      postId,
      totalViews,
      uniqueViews,
      dailyViews
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar analytics do post' });
  }
};

async function getTotalViews(startDate) {
  return await PageView.countDocuments({
    timestamp: { $gte: startDate }
  });
}

async function getUniqueVisitors(startDate) {
  const uniqueSessions = await PageView.distinct('sessionId', {
    timestamp: { $gte: startDate }
  });
  return uniqueSessions.length;
}

async function getMostReadPosts(startDate, limit = 5) {
  const pipeline = [
    {
      $match: {
        postId: { $ne: null },
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$postId',
        views: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: '_id',
        as: 'post'
      }
    },
    {
      $unwind: '$post'
    },
    {
      $project: {
        postId: '$_id',
        title: '$post.title',
        slug: '$post.slug',
        views: 1
      }
    },
    {
      $sort: { views: -1 }
    },
    {
      $limit: limit
    }
  ];

  return await PageView.aggregate(pipeline);
}

async function getDeviceBreakdown(startDate) {
  const pipeline = [
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$deviceType',
        count: { $sum: 1 }
      }
    }
  ];

  const results = await PageView.aggregate(pipeline);
  
  const breakdown = { desktop: 0, mobile: 0, tablet: 0 };
  results.forEach(item => {
    breakdown[item._id] = item.count;
  });

  return breakdown;
}

async function getOSBreakdown(startDate) {
  const pipeline = [
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$operatingSystem',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ];

  const results = await PageView.aggregate(pipeline);
  
  const breakdown = {};
  results.forEach(item => {
    breakdown[item._id] = item.count;
  });

  return breakdown;
}

async function getDailyViews(startDate, days) {
  const pipeline = [
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$timestamp'
          }
        },
        views: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ];

  const results = await PageView.aggregate(pipeline);
  
  const dailyViews = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayData = results.find(item => item._id === dateString);
    dailyViews.push({
      date: dateString,
      views: dayData ? dayData.views : 0
    });
  }

  return dailyViews;
}

async function getPostDailyViews(postId, startDate, days) {
  const pipeline = [
    {
      $match: {
        postId: postId,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$timestamp'
          }
        },
        views: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ];

  const results = await PageView.aggregate(pipeline);
  
  const dailyViews = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayData = results.find(item => item._id === dateString);
    dailyViews.push({
      date: dateString,
      views: dayData ? dayData.views : 0
    });
  }

  return dailyViews;
}

async function updatePostAnalytics(postId, sessionId) {
  try {
    const existingView = await PageView.findOne({
      postId,
      sessionId,
      timestamp: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    });

    const update = { $inc: { totalViews: 1 } };
    if (!existingView) {
      update.$inc.uniqueViews = 1;
    }
    update.lastUpdated = new Date();

    await PostAnalytics.findOneAndUpdate(
      { postId },
      update,
      { upsert: true, new: true }
    );
  } catch {
    return;
  }
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
}

function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  
  // Detectar tablet primeiro (mais específico)
  if (/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }
  
  // Detectar mobile
  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|fennec/i.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

function getOperatingSystem(userAgent) {
  // Windows - diferentes versões
  if (/windows nt 10|windows 10/i.test(userAgent)) return 'Windows 10/11';
  if (/windows nt 6.3/i.test(userAgent)) return 'Windows 8.1';
  if (/windows nt 6.2/i.test(userAgent)) return 'Windows 8';
  if (/windows nt 6.1/i.test(userAgent)) return 'Windows 7';
  if (/windows nt/i.test(userAgent)) return 'Windows';
  
  // macOS/iOS
  if (/iphone|ipod/i.test(userAgent)) return 'iOS (iPhone)';
  if (/ipad/i.test(userAgent)) return 'iOS (iPad)';
  if (/mac os x|macintosh/i.test(userAgent)) return 'macOS';
  
  // Android
  if (/android/i.test(userAgent)) {
    const androidMatch = userAgent.match(/android\s([\d.]+)/i);
    if (androidMatch) {
      return `Android ${androidMatch[1]}`;
    }
    return 'Android';
  }
  
  // Linux
  if (/ubuntu/i.test(userAgent)) return 'Ubuntu';
  if (/linux/i.test(userAgent)) return 'Linux';
  
  // Outros sistemas
  if (/chrome os/i.test(userAgent)) return 'Chrome OS';
  if (/cros/i.test(userAgent)) return 'Chrome OS';
  
  return 'Outros';
}

function getDaysFromPeriod(period) {
  switch (period) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    default: return 30;
  }
}