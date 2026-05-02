const listMenus = async (_req, res) => {
  return res.status(200).json({ data: [] });
};

const createMenu = async (_req, res) => {
  return res.status(501).json({ error: 'Menu management is not available.' });
};

module.exports = { listMenus, createMenu };
