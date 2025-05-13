import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";
import Admin from "../Model/Admin.model.js";
import Order from "../Model/Order.model.js";

export const postNewUser = async (req, res) => {
  const { name, phone, table } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (name.trim() == 0 || name.length < 1) {
    return res
      .status(400)
      .json({ message: "Name char must be more then one " });
  }

  try {
    const isExistingUser = await User.findOne({ phone });
    if (isExistingUser) {
      return res
        .status(200)
        .json({ message: "User already registered", user: isExistingUser });
    }

    const newUser = await User({
      name,
      phone,
      table,
    });

    const OrderDetails = await Order.findByIdAndUpdate();

    await newUser.save();
    res.status(200).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const putUser = async (req, res) => {
  const { name, phone, table } = req.body;
  if (name.length === 0 || phone.length <= 10) {
    return res
      .status(400)
      .json({ message: "All fields required with valid value" });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid details" });
    }

    if (name) {
      existingUser.name = name;
    }
    if (phone) {
      phone.trim();
      existingUser.phone = phone;
    }
    if (table) {
      existingUser.table = table;
    }

    await existingUser.save();
    res
      .status(200)
      .json({ message: "user updated Successfully", user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const postNewAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.trim() == 0 || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 char long" });
    }

    const isExistingUser = await Admin.findOne({ email: email });

    if (isExistingUser) {
      return res.status(400).json({ message: "User alreday ragistered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegx.test(email)) {
      return res
        .status(400)
        .json({ message: "Email structure is not correct" });
    }

    const newUser = new Admin({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "user Ragistred Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const isExistingUser = await Admin.findOne({ email: email });
    if (!isExistingUser) {
      return res.status(400).json({ message: "User is not ragistered" });
    }
    const verifyPassword = bcrypt.compareSync(
      password,
      isExistingUser.password
    );
    if (!verifyPassword) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    const payload = {
      id: isExistingUser._id,
      username: isExistingUser.username,
    };
    const token = jwt.sign(payload, process.env.JWTSECRET);

    // res.cookie("token", token, {
    //   httpOnly: false, // should be true for security, unless you intentionally need JS access
    //   secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
    //   sameSite: "Lax", // you can also use "Lax" for more leniency if needed
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });

    // res.cookie("token", token, {
    //   httpOnly: false,
    //   sameSite: "Lax",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "Login successfully", token, content: isExistingUser });
  } catch (error) {
    return res.status(500).json({ message: "Interal server error", error });
  }
};

export const LogoutUser = async (req, res) => {
  try {
    if (req.cookie && req.cookie.length > 2) {
      res.cookie = null;
    }
    return res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const profileUser = async (req, res) => {
  const { username, password, profilePic } = req.body;
  const { _id } = req.params;
  if ((!username && !password) || !password.trim() == 0) {
    return res.status(400).json({ message: "Only one field is required" });
  }

  const isExistingUser = await User.findOne({ _id: _id });
  if (!isExistingUser) {
    return res.status(400).json({ message: "Unouthorized User" });
  }

  const updatedContent = {};

  if (username?.trim()) {
    updatedContent.username = username.trim();
  }

  if (password?.trim) {
    const hashedPassword = await bcrypt.hash(password.trim(), 12);
    updatedContent.password = hashedPassword;
  }

  if (profilePic?.trim()) {
    updatedContent.profilePic = profilePic.trim();
  }

  if (Object.entries(updatedContent).length === 0) {
    return res.status(400).json({ message: "there is not data for updation" });
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: updatedContent }
    );
    res.status(200).json({ message: "Data has updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
