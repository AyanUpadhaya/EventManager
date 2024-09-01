const {connectionToDatabase} = require("../database/db")

function initializeServer(app, port) {
  connectionToDatabase()
    .then(() => {
      app.listen(port, () => console.log(`Server running on port:${port}`));
    })
    .catch((error) => {
      console.log(error);
      process.exit();
    });
}

module.exports = { initializeServer };
