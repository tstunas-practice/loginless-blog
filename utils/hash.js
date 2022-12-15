const bcrypt = require("bcrypt");

async function hashPassword(password) {
  salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
