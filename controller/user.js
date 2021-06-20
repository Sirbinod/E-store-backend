const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userList = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    if (!user) {
      res.status(404).json({success: false, message: "user not empty"});
    }
    res.status(200).json({success: true, data: user});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.userListById = async (req, res) => {
  const _id = req.params.id;
  try {
    if (!_id) {
      res
        .status(404)
        .json({success: false, message: "user not found given id"});
    } else {
      const user = await User.findById(_id).select("-password");
      res.status(200).json({success: true, data: user});
    }
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.userCreate = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    city,
    zipCode,
    country,
  } = req.body;
  try {
    const exitEmail = await User.findOne({email: email});
    if (exitEmail) {
      res
        .status(409)
        .json({success: false, message: "this email alreadty exit"});
    } else {
      const user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        phone,
        isAdmin,
        street,
        city,
        zipCode,
        country,
      });
      const newUser = await user.save();
      res.status(201).json({
        success: true,
        message: "User create successfulll",
        user: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({success: false, message: error});
    console.log(error);
  }
};

exports.userDelete = async (req, res) => {
  const _id = req.params.id;
  try {
    const userDel = await User.findByIdAndDelete(_id);
    if (!_id) {
      res
        .status(404)
        .json({success: false, message: "user not found given id"});
    } else {
      res.status(200).json({success: true, message: "User delete successfull"});
    }
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.userUpdate = async (req, res) => {
  const _id = req.params.id;
  try {
    const userExit = await User.findById(_id);
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExit.password;
    }
    const user = await User.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
      },
      {new: true}
    );
    res
      .status(201)
      .json({success: true, message: "user update successfull", user});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.userCount = async (req, res) => {
  try {
    const countUser = await User.countDocuments((count) => count);
    res.status(200).json({success: true, CountUser: countUser});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

exports.userLogin = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    const secert = process.env.SECERT;
    if (!user) {
      return res.status(400).json({success: false, message: "Use not here"});
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({userId: user.id, isAdmin: user.isAdmin}, secert, {
        expiresIn: "1d",
      });
      const email = user.email;
      res
        .status(201)
        .json({success: true, massege: "user auth", user: {email, token}});
    } else {
      res.status(400).json({success: true, massege: "passwort dont match"});
    }
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};
