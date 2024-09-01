const dontenv = require("dotenv");
dontenv.config();
const express = require("express");
const mainRouter = require("./routes/mainRouter");
const { initializeServer } = require("./config/server.config");
const { PORT } = require("./utils/constants");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mainRouter);
initializeServer(app, PORT);
