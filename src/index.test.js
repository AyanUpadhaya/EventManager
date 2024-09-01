const bcrypt = require("bcrypt");
const hashPassword = async (password, saltRounds = 10) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const comparePassword = async (password, hash) => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (err) {
    console.log(err);
    return err;
  }
};




async function getHashpassword(){
    const myPassword = "123456";
    const hashedPassword = await hashPassword(myPassword);

    console.log("Hashed Password:", hashedPassword);
    console.log("Type of Password:", typeof hashedPassword);

    const isValid = await comparePassword(
      myPassword,
      "$2b$10$wOXpKyqPMS4KngenNI3FzuwqD1ixqoCK.KT9MchJCBvYpRLoD.QB2"
    );
    console.log("Is Password Valid?", isValid);

    // const wrongPassword = "wrongpassword";
    // const isInvalid = await comparePassword(wrongPassword, hashedPassword);
    // console.log("Is Wrong Password Valid?", isInvalid);
}

getHashpassword();