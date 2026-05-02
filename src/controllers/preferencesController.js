const supabase = require('../config/supabase');

const resolveUserNim = async (authId) => {
  const { data, error } = await supabase
    .from('users')
    .select('nim')
    .eq('auth_id', authId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.nim ?? null;
};

const getPreferences = async (req, res) => {
  try {
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('nim')
      .eq('auth_id', req.user.id)
      .maybeSingle();

    if (userErr) return res.status(500).json({ error: userErr.message });
    if (!user) {
      return res.status(200).json({ data: { favorite_canteen_ids: [] } });
    }

    const { data: favs, error: favErr } = await supabase
      .from('favorite_canteens')
      .select('canteen_id')
      .eq('user_nim', user.nim);

    if (favErr) return res.status(500).json({ error: favErr.message });

    return res.status(200).json({
      data: { favorite_canteen_ids: (favs ?? []).map((f) => f.canteen_id) },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const upsertPreferences = async (req, res) => {
  try {
    const nim = await resolveUserNim(req.user.id);
    if (!nim) {
      return res.status(400).json({ error: 'Profile belum diisi. Silakan isi NIM terlebih dahulu.' });
    }

    const { favorite_canteen_ids } = req.body;

    if (Array.isArray(favorite_canteen_ids)) {
      const { error: delErr } = await supabase
        .from('favorite_canteens')
        .delete()
        .eq('user_nim', nim);
      if (delErr) return res.status(500).json({ error: delErr.message });

      if (favorite_canteen_ids.length > 0) {
        const rows = favorite_canteen_ids.map((canteen_id) => ({ user_nim: nim, canteen_id }));
        const { error: insErr } = await supabase.from('favorite_canteens').insert(rows);
        if (insErr) return res.status(500).json({ error: insErr.message });
      }
    }

    return res.status(200).json({
      data: { favorite_canteen_ids: favorite_canteen_ids ?? [] },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getPreferences, upsertPreferences };
