const bcrypt = require("bcrypt");

export async function hashPassword(password) {
  salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
