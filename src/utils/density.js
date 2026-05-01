const LOW_THRESHOLD = 0.35;
const PEAK_THRESHOLD = 0.75;

const classifyDensity = (headCount, capacity) => {
  if (!capacity || capacity <= 0) return 'unknown';
  const ratio = headCount / capacity;
  if (ratio < LOW_THRESHOLD) return 'low';
  if (ratio < PEAK_THRESHOLD) return 'moderate';
  return 'peak';
};

const occupancyRatio = (headCount, capacity) => {
  if (!capacity || capacity <= 0) return 0;
  return Math.min(1, Math.max(0, headCount / capacity));
};

module.exports = { classifyDensity, occupancyRatio };
