import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import connectToDB from '../../../lib/mongoose.js';

const mongoDbUrl = process.env.MEMORIES_MONGODB_URL;

const createJwtToken = (existingUser) => {
  return jwt.sign({
    email: existingUser.email,
    id: existingUser._id,
    name: existingUser.name,
    picture: null,
  }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectToDB(mongoDbUrl, 'Memories');
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });
    const token = createJwtToken(existingUser);
    res.status(200).json({ credential: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  try {
    await connectToDB(mongoDbUrl, 'Memories');
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    });
    const token = createJwtToken(result);
    res.status(200).json({ credential: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
