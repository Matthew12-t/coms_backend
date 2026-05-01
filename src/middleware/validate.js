const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = req.body?.[field];
    const isMissing = value === undefined || value === null || value === '';

    if (rule.required && isMissing) {
      errors.push(`${field} is required`);
      continue;
    }
    if (isMissing) continue;

    if (rule.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be a number`);
    } else if (rule.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
    } else if (rule.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${field} must be a boolean`);
    } else if (rule.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} must be an array`);
    }

    if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
      errors.push(`${field} must be >= ${rule.min}`);
    }
  }

  if (errors.length) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  return next();
};

module.exports = { validate };
