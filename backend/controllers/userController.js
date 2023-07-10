const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs'); //hash password
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

//@desc Register a new user
//@route /api/users
//@access (do we need to authenticate /send token?) PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //validate
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }
  //find if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists!');
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // needs user id
    });
  } else {
    res.status(400);
    throw new error('Invalid user data');
  }
});

//@desc Login a new user
//@route /api/users/login
//@access (do we need to authenticate /send token?) PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  //get email & pass from the body that we send
  const { email, password } = req.body;

  //check user and passwords match
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // needs user id
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

//@desc Get current user
//@route /api/users/me
//@access (do we need to authenticate /send token?) PRIVATE
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(req.user);
});

//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
