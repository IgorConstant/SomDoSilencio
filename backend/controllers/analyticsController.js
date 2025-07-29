import Analytics from '../models/Analytics.js';

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