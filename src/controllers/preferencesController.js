const supabase = require('../config/supabase');

const getPreferences = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data: data ?? defaultPreferences(req.user.id) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const upsertPreferences = async (req, res) => {
  try {
    const payload = {
      user_id: req.user.id,
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const defaultPreferences = (userId) => ({
  user_id: userId,
  favorite_canteen_ids: [],
  notify_on_low_density: true,
  push_token: null,
});

module.exports = { getPreferences, upsertPreferences };
