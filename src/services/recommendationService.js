const supabase = require('../config/supabase');
const { haversineDistanceKm } = require('../utils/distance');
const { occupancyRatio } = require('../utils/density');

const DENSITY_WEIGHT = 0.7;
const DISTANCE_WEIGHT = 0.3;
const MAX_DISTANCE_KM = 2;

const buildBestChoice = async ({ latitude, longitude } = {}) => {
  const { data: canteens, error: canteenErr } = await supabase
    .from('canteens')
    .select('*')
    .eq('is_active', true);
  if (canteenErr) throw new Error(canteenErr.message);

  const { data: latest, error: latestErr } = await supabase
    .from('canteen_latest_occupancy')
    .select('*');
  if (latestErr) throw new Error(latestErr.message);

  const latestMap = new Map(latest.map((row) => [row.canteen_id, row]));

  const scored = canteens.map((c) => {
    const occ = latestMap.get(c.id);
    const headCount = occ?.head_count ?? 0;
    const ratio = occupancyRatio(headCount, c.capacity);
    const distanceKm = haversineDistanceKm(latitude, longitude, c.latitude, c.longitude);
    const normalizedDistance =
      distanceKm == null ? 0 : Math.min(1, distanceKm / MAX_DISTANCE_KM);
    const score = ratio * DENSITY_WEIGHT + normalizedDistance * DISTANCE_WEIGHT;
    return {
      ...c,
      head_count: headCount,
      density_level: occ?.density_level ?? 'unknown',
      distance_km: distanceKm,
      score,
    };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored;
};

module.exports = { buildBestChoice };
