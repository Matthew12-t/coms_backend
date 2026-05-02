const supabase = require('../config/supabase');

const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('nim, name, major')
      .eq('auth_id', req.user.id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({
      data: {
        full_name: data?.name ?? null,
        student_id: data?.nim ?? null,
        major: data?.major ?? null,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const upsertProfile = async (req, res) => {
  try {
    const { full_name, student_id, major } = req.body;

    const { data, error } = await supabase
      .from('users')
      .upsert(
        { auth_id: req.user.id, nim: student_id, name: full_name, major },
        { onConflict: 'auth_id' }
      )
      .select('nim, name, major')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({
      data: {
        full_name: data.name,
        student_id: data.nim,
        major: data.major,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, upsertProfile };
