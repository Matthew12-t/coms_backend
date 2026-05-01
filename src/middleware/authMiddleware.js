const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing access token' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    req.accessToken = token;
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      if (data?.user) {
        req.user = data.user;
        req.accessToken = token;
      }
    }
  } catch {}
  return next();
};

module.exports = { requireAuth, optionalAuth };
