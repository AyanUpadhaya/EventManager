const bcrypt = require("bcrypt");

const hashPassword = async (password, saltRounds = 10) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
  }
};

const comparePassword = async (password, hash) => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  hashPassword,
  comparePassword,
};
