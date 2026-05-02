const supabase = require('../config/supabase');

const DEFAULT_EMAIL_REDIRECT = 'http://localhost:5173/auth/callback';

const resolveEmailRedirect = () =>
  process.env.EMAIL_REDIRECT_URL || DEFAULT_EMAIL_REDIRECT;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: resolveEmailRedirect() },
    });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token_hash, type } = req.body;
    if (!token_hash || !type) {
      return res.status(400).json({ error: 'token_hash and type are required' });
    }

    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const exchangeCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required' });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  return res.status(200).json({ data: req.user });
};

module.exports = { register, verifyEmail, exchangeCode, login, logout, me };
