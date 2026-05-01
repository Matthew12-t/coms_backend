const { fetchPeakHours, fetchDailyAverages } = require('../services/analyticsService');
const { buildBestChoice } = require('../services/recommendationService');

const peakHours = async (req, res) => {
  try {
    const { range, canteen_id } = req.query;
    const data = await fetchPeakHours({ range, canteenId: canteen_id });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const dailyAverages = async (req, res) => {
  try {
    const { canteen_id } = req.query;
    const data = await fetchDailyAverages({ canteenId: canteen_id });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const recommendations = async (req, res) => {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : undefined;
    const lng = req.query.lng ? Number(req.query.lng) : undefined;
    const data = await buildBestChoice({ latitude: lat, longitude: lng });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { peakHours, dailyAverages, recommendations };
