const supabase = require('../config/supabase');

const listMenus = async (req, res) => {
  try {
    const { canteen_id } = req.query;
    let query = supabase.from('menus').select('*').eq('is_available', true);
    if (canteen_id) query = query.eq('canteen_id', canteen_id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createMenu = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .insert([req.body])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { listMenus, createMenu };
