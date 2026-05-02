const supabase = require('../config/supabase');
const { occupancyRatio } = require('../utils/density');

const resolveLatestOccupancy = (logs) => {
  const map = new Map();
  for (const row of logs) {
    if (!map.has(row.canteen_id)) map.set(row.canteen_id, row);
  }
  return map;
};

const resolveDensityLevel = (ratio) => {
  if (ratio < 0.2) return 'low';
  if (ratio < 0.5) return 'moderate';
  return 'peak';
};

const buildBestChoice = async () => {
  const { data: canteens, error: canteenErr } = await supabase
    .from('canteens')
    .select('*')
    .eq('is_open', true);
  if (canteenErr) throw new Error(canteenErr.message);

  const { data: logs, error: logsErr } = await supabase
    .from('occupancy_logs')
    .select('canteen_id, head_count, created_at')
    .order('created_at', { ascending: false });
  if (logsErr) throw new Error(logsErr.message);

  const latestMap = resolveLatestOccupancy(logs);

  return canteens
    .map((c) => {
      const occ = latestMap.get(c.id);
      const headCount = occ?.head_count ?? 0;
      const ratio = occupancyRatio(headCount, c.capacity_max);
      return {
        ...c,
        head_count: headCount,
        density_level: resolveDensityLevel(ratio),
        score: ratio,
      };
    })
    .sort((a, b) => a.score - b.score);
};

module.exports = { buildBestChoice };
