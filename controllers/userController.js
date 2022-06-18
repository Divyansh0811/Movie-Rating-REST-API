const bcrypt = require("bcryptjs/dist/bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");

//DESCRIPTION: Login a user
//ROUTE: POST /api/user
//ACCESS: public
const loginUser = asyncHandler(async (req, res) => {
 const { email, password } = req.body;
 if (!email || !password) {
  res.status(400);
  throw new Error("Please fill all feilds");
 }
 const checkPasswordAndTimeout = async () => {
  //compare passwords
  if (await bcrypt.compare(password, user.password)) {
   res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
   });
  } else {
   //else incerement user login counter
   let counter = user.timeout.counter;
   counter = counter + 1;
   //if login counter === 4 then change timeoutTimestamp in user data to current date.
   let timeoutTimestamp = null;
   if (counter === 4) {
    timeoutTimestamp = new Date();
   }
   await User.findByIdAndUpdate(user._id, {
    timeout: {
     timeoutTimestamp,
     counter,
    },
   });
   if (counter === 4) {
    res
     .status(404)
     .json({ message: "Too many attempts, please try again after 30 minutes" });
   } else {
    res.status(401).json({ message: `${4 - counter} attempts remaining` });
   }
  }
 };
 let user = await User.findOne({ email });
 if (user) {
  //check if timeoutTimestamp is null, if time remaining is null then go with normal flow
  if (!user.timeout.timeoutTimestamp) {
   //if password is correct then login the user
   await checkPasswordAndTimeout();
  } else {
   // else find the difference between current time and timeoutTimestamp in user data.
   const endTime = moment(new Date());
   const startTime = moment(user.timeout.timeoutTimestamp);

   let timeRemaining = (duration = moment.duration(endTime.diff(startTime)));
   timeRemaining = parseInt(duration.asMinutes()) % 60;

   // if difference is greater than 30 minutes then update paramaters and repeat process
   if (timeRemaining > 30) {
    user = await User.findByIdAndUpdate(
     user._id,
     {
      timeout: {
       timeoutTimestamp: null,
       counter: 0,
      },
     },
     { new: true }
    );
    await checkPasswordAndTimeout();
   } else {
    res
     .status(401)
     .json({ message: `Please try again after ${30 - timeRemaining} minutes` });
   }
  }
 } else {
  res.status(400);
  throw new Error("User does not exists");
 }
});

//DESCRIPTION: register a user
//ROUTE: POST /api/user/register
//ACCESS: public
const registerUser = asyncHandler(async (req, res) => {
 const { name, email, password, age } = req.body;
 if (!name || !email || !password || !age) {
  res.status(400);
  throw new Error("Please add all fields");
 }

 //email is unique for everyone
 const userAlreadyExists = await User.findOne({ email });
 if (userAlreadyExists) {
  res.status(400);
  throw new Error("User already exists");
 }

 //Hashing the password isntead of storing it as plain text
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(password, salt);

 //Creating a user
 const user = await User.create({
  name,
  email,
  password: hashedPassword,
  age,
 });

 if (user) {
  res.status(200).json({
   _id: user.id,
   name: user.name,
   email: user.email,
   age: user.age,
   token: generateToken(user._id), //sending token for frontend authentication
  });
 } else {
  res.status(400);
  throw new Error("Invalid user data");
 }
});
const generateToken = (id) => {
 return jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: "30d",
 });
};

module.exports = { registerUser, loginUser, generateToken };
