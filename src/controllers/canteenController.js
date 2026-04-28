const supabase = require('../config/supabase');

const getAllCanteens = async (req, res) => {
  try {
    const { data, error } = await supabase.from('canteens').select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCanteens };
