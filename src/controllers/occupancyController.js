const supabase = require('../config/supabase');

const logOccupancy = async (req, res) => {
  try {
    const { canteen_id, head_count } = req.body;

    if (canteen_id === undefined || head_count === undefined) {
      return res.status(400).json({ error: 'canteen_id and head_count are required' });
    }

    const { data, error } = await supabase
      .from('occupancy_logs')
      .insert([{ canteen_id, head_count }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { logOccupancy };
