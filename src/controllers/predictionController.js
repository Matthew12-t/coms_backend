const supabase = require('../config/supabase');

const ingestPrediction = async (req, res) => {
  try {
    const { canteen_id, head_count } = req.body;

    const { data, error } = await supabase
      .from('occupancy_logs')
      .insert([{ canteen_id, head_count }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { ingestPrediction };
