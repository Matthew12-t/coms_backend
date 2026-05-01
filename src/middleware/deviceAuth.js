const requireDeviceKey = (req, res, next) => {
  const expected = process.env.DEVICE_INGEST_KEY;
  if (!expected) return next();
  const provided = req.headers['x-device-key'];
  if (provided !== expected) {
    return res.status(401).json({ error: 'Invalid device key' });
  }
  return next();
};

module.exports = { requireDeviceKey };
