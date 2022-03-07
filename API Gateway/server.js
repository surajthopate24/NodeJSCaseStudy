/**Load Express For Performing Crud Operation */
const express = require("express");
/**Load Routes to get files from routes.js */
const { ROUTES } = require("./routes");
/**Load Logger For Setup  */
const { setupLogging } = require("./logging");
/**Load Proxy to Return Express Middleware */
const { setupProxies } = require("./proxy");
/**Load Body-Parser To Convert Json Data Into String In Postman*/
const bodyParser = require("body-parser");
/**Load mongoose to Connect Nodejs And MongoDb Atlas */
const mongoose = require("mongoose");
/**Load The Schema Model User */
const User = require("./model/user");
/**Load the bcryptjs */
const bcrypt = require("bcryptjs");
/**Load Json Web Token */
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";
/**Load the Method For Express */
const app = express();
/**Initialize Port Number */
const port = 3001;
/**Load the Method For Logger */
setupLogging(app);
/**Load the Method For Proxy */
setupProxies(app, ROUTES);
/**Method For Converting JSON Data Into String */
app.use(bodyParser.json());
/**MongoDB Atlas Connection String */
mongoose.connect(
  "mongodb+srv://suraj:suraj@cluster0.s8dvi.mongodb.net/SecurityService?retryWrites=true&w=majority",
  () => {
    console.log("Connected to Security Database...");
  }
);

/**REST API For Login JWT */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid password" });
});


/**REST API For Register JWT */
app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok",msg:"User Registered Succesfully" });
});

/**Listen to Server */
app.listen(port, () => {
  console.log(`API Gateway Port : http://localhost:${port}`);
});
