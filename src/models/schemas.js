const predictionSchema = {
  canteen_id: { required: true, type: 'string' },
  head_count: { required: true, type: 'number', min: 0 },
};

const occupancySchema = {
  canteen_id: { required: true, type: 'string' },
  head_count: { required: true, type: 'number', min: 0 },
};

const notificationSchema = {
  canteen_id: { required: true, type: 'string' },
  threshold: { required: true, type: 'number', min: 0 },
};

const preferencesSchema = {
  favorite_canteen_ids: { type: 'array' },
  notify_on_low_density: { type: 'boolean' },
  push_token: { type: 'string' },
};

const menuSchema = {
  canteen_id: { required: true, type: 'string' },
  name: { required: true, type: 'string' },
  price: { required: true, type: 'number', min: 0 },
};

const authSchema = {
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
};

module.exports = {
  predictionSchema,
  occupancySchema,
  notificationSchema,
  preferencesSchema,
  menuSchema,
  authSchema,
};
