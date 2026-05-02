require('dotenv').config();

const express = require('express');
const cors = require('cors');

const canteenRoutes = require('./routes/canteenRoutes');
const occupancyRoutes = require('./routes/occupancyRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/occupancy', occupancyRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
