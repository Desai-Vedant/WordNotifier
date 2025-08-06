import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.ts';
import EmailService from '../services/EmailService.ts';


dotenv.config();

export const signup = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create new user
    const user = new User({
      name,
      email,
      password,
      verificationCode,
    });

    await user.save();

    // Send verification email
    await EmailService.sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'User created. Please check your email for verification code.' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user: ' + error });
  }
};

export const verifyEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email, verificationCode });
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying email' });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error });
  }
};

export const sendOTP = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    user.verificationCode = verificationCode;
    await user.save();

    await EmailService.sendVerificationEmail(email, verificationCode);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

export const verifyOTP = async (req: express.Request, res: express.Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, verificationCode: otp });
    if (!user) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};
