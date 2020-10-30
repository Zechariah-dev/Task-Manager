const { Router } = require("express");
const User = require("../models/User");
const {
  validateSignupData,
  validateLoginData
} = require("../middlewares/validation");
const router = Router();

router.post("/signup", async (req, res) => {
  const signupValidationResult = await validateSignupData(req.body);

  if (!signupValidationResult.valid) {
    return res.status(403).json(signupValidationResult);
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email }).exec();

    if (existingUser) {
      return res.status(403).json({ msg: "Creditenials already in use" });
    }

    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname
    });

    await user.save();

    res.json({ message: "signup successful", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const loginValidationResult = validateLoginData(req.body);

  if (!loginValidationResult.valid) {
    return res.status(403).json(loginValidationResult);
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const isMatch = await user.validatePassword(req.body.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ token, msg: "Login successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});
