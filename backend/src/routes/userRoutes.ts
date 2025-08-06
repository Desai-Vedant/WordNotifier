import express from 'express';
import * as UserController from '../controllers/UserController.ts';

const router = express.Router();

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/verify-email', UserController.verifyEmail);
router.post('/send-otp', UserController.sendOTP);
router.post('/verify-otp', UserController.verifyOTP);

export default router;
