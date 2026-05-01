const supabase = require('../config/supabase');
const { triggerNotificationsForCanteen } = require('../services/notificationService');

const ingestPrediction = async (req, res) => {
  try {
    const { canteen_id, head_count } = req.body;

    const { data, error } = await supabase
      .from('occupancy_logs')
      .insert([{ canteen_id, head_count }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const triggered = await triggerNotificationsForCanteen(canteen_id, head_count);

    return res.status(201).json({ data, triggered_count: triggered.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { ingestPrediction };
