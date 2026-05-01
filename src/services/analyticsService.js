const supabase = require('../config/supabase');

const RANGE_TO_HOURS = { day: 24, week: 24 * 7, month: 24 * 30 };

const buildSinceDate = (range) => {
  const hours = RANGE_TO_HOURS[range] ?? RANGE_TO_HOURS.day;
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
};

const fetchPeakHours = async ({ range = 'day', canteenId } = {}) => {
  const since = buildSinceDate(range);
  let query = supabase
    .from('occupancy_logs')
    .select('canteen_id, head_count, created_at')
    .gte('created_at', since);
  if (canteenId) query = query.eq('canteen_id', canteenId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const buckets = new Map();
  for (const row of data) {
    const hour = new Date(row.created_at).getHours();
    const bucket = buckets.get(hour) || { hour, total: 0, samples: 0 };
    bucket.total += row.head_count;
    bucket.samples += 1;
    buckets.set(hour, bucket);
  }

  return Array.from(buckets.values())
    .map(({ hour, total, samples }) => ({
      hour,
      avg_head_count: samples ? Math.round(total / samples) : 0,
    }))
    .sort((a, b) => a.hour - b.hour);
};

const fetchDailyAverages = async ({ canteenId } = {}) => {
  const since = buildSinceDate('month');
  let query = supabase
    .from('occupancy_logs')
    .select('canteen_id, head_count, created_at')
    .gte('created_at', since);
  if (canteenId) query = query.eq('canteen_id', canteenId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const buckets = new Map();
  for (const row of data) {
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    const bucket = buckets.get(day) || { day, total: 0, samples: 0 };
    bucket.total += row.head_count;
    bucket.samples += 1;
    buckets.set(day, bucket);
  }

  return Array.from(buckets.values())
    .map(({ day, total, samples }) => ({
      day,
      avg_head_count: samples ? Math.round(total / samples) : 0,
    }))
    .sort((a, b) => a.day.localeCompare(b.day));
};

module.exports = { fetchPeakHours, fetchDailyAverages };
