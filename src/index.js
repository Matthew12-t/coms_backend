require('dotenv').config();

const express = require('express');
const cors = require('cors');

const canteenRoutes = require('./routes/canteenRoutes');
const occupancyRoutes = require('./routes/occupancyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/canteens', canteenRoutes);
app.use('/api/occupancy', occupancyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
