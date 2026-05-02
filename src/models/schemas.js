const predictionSchema = {
  canteen_id: { required: true, type: 'string' },
  head_count: { required: true, type: 'number', min: 0 },
};

const occupancySchema = {
  canteen_id: { required: true, type: 'string' },
  head_count: { required: true, type: 'number', min: 0 },
};

const preferencesSchema = {
  favorite_canteen_ids: { type: 'array' },
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

const profileSchema = {
  full_name: { type: 'string' },
  student_id: { type: 'string' },
  major: { type: 'string' },
};

module.exports = {
  predictionSchema,
  occupancySchema,
  preferencesSchema,
  menuSchema,
  authSchema,
  profileSchema,
};
