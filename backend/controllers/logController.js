import Log from '../models/Log.js';

/* global console */

export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, resourceType, startDate, endDate } = req.query;
    
    const filter = {};
    
    if (action) filter.action = action;
    if (resourceType) filter.resourceType = resourceType;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(filter)
      .populate('userId', 'email')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Log.countDocuments(filter);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar logs' });
  }
};

export const getLogStats = async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const recentActivity = await Log.find()
      .populate('userId', 'email')
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({ stats, recentActivity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};
