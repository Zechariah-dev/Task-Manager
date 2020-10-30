const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const config = require("./config");
const bodyParser = require("body-parser");

const app = express();

app.set("trust proxy", true);
app.set("port", 3000);

const mongoose = require("mongoose");
const connectRetry = function () {
  mongoose.connect(
    config.mongoUri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    (err) => {
      if (err) {
        console.log("Mongoose connection error:", err);
        setTimeout(connectRetry, 5000);
      }
    }
  );
};
connectRetry();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.json({ urlencoded: true }));

app.get("/", (req, res) => {
  res.send("good ebening");
});

app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/task", require("./routes/task"));

app.listen(app.get("port") || process.env.PORT, () => {
  console.log("🚀 Task Manager server started:", config.publicDomain);
});
