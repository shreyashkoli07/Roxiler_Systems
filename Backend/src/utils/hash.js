const bcrypt = require('bcryptjs');
const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

exports.hashPassword = async (plain) => await bcrypt.hash(plain, rounds);
exports.comparePassword = async (plain, hash) => await bcrypt.compare(plain, hash);
