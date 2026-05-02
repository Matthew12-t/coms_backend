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
    const { data: canteens, error: canteenErr } = await supabase
      .from('canteens')
      .select('id, name, capacity_max');
    if (canteenErr) return res.status(500).json({ error: canteenErr.message });

    const { data: logs, error: logsErr } = await supabase
      .from('occupancy_logs')
      .select('canteen_id, head_count, created_at')
      .order('created_at', { ascending: false });
    if (logsErr) return res.status(500).json({ error: logsErr.message });

    const latestMap = new Map();
    for (const row of logs) {
      if (!latestMap.has(row.canteen_id)) latestMap.set(row.canteen_id, row);
    }

    const data = canteens.map((c) => {
      const occ = latestMap.get(c.id);
      const headCount = occ?.head_count ?? 0;
      const ratio = c.capacity_max > 0 ? headCount / c.capacity_max : 0;
      const densityLevel = ratio < 0.2 ? 'low' : ratio < 0.5 ? 'moderate' : 'peak';
      return {
        canteen_id: c.id,
        name: c.name,
        head_count: headCount,
        capacity_max: c.capacity_max,
        density_level: densityLevel,
        created_at: occ?.created_at ?? null,
      };
    });

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
