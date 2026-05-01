const supabase = require('../config/supabase');

const logOccupancy = async (req, res) => {
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

const getLatestOccupancy = async (req, res) => {
  try {
    const { data, error } = await supabase.from('canteen_latest_occupancy').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getCanteenHistory = async (req, res) => {
  try {
    const { canteen_id } = req.params;
    const limit = Number(req.query.limit) || 100;
    const { data, error } = await supabase
      .from('occupancy_logs')
      .select('*')
      .eq('canteen_id', canteen_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { logOccupancy, getLatestOccupancy, getCanteenHistory };
