const mongoose = require("mongoose");
const app = require("./app");

require("dotenv").config();

const mongoString = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000;

/* Connecting to the database and then starting the server. */
mongoose
  .connect(mongoString)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started at http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
