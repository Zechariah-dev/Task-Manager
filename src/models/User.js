const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 7
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(config.salt);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id.toString() }, config.jwtsecret);

  return token;
};

const User = model("users", UserSchema);

module.exports = User;
