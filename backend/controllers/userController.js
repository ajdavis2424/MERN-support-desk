const asyncHandler = require('express-async-handler');

//@desc Register a new user
//@route /api/users
//@access (do we need to authenticate /send token?) PUBLIC
const registerUser = asyncHandler((req, res) => {
  const { name, email, password } = req.body;
  //validate
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  res.send(`Register Route`);
});

//@desc Login a new user
//@route /api/users/login
//@access (do we need to authenticate /send token?) PUBLIC
const loginUser = asyncHandler((req, res) => {
  res.send(`Login Route`);
});

module.exports = {
  registerUser,
  loginUser,
};
