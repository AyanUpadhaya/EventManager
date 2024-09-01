const {createPool} = require("mysql2/promise");

const pool = createPool({
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
});

const connectionToDatabase = async () => {
  try {
    await pool.getConnection();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection error");
    console.log(error);
  }
};

module.exports={
    pool,
    connectionToDatabase
}