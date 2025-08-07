import express from 'express';
import Notification from '../models/Notification';
import type {IUser} from '../models/User';
import { sendNotifications } from '../services/notificationService';

interface AuthRequest extends express.Request {
  user?: IUser;
}

export const sendReminders = async (req: AuthRequest, res: express.Response) => {
  try {
    // Call the sendNotifications function to send reminders
    const result = await sendNotifications();

    return res.status(200).json({ message: 'Reminders sent successfully', count: result });
  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ error: 'Error sending reminders' });
  }
};

export const createNotification = async (req: AuthRequest, res: express.Response) => {
  try {
    const { japaneseWord, englishMeaning, marathiMeaning, reminderTime } = req.body;
    
    const notification = new Notification({
      userId: req.user!._id,
      japaneseWord,
      englishMeaning,
      marathiMeaning,
      reminderTime,
    });

    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};

export const getUserNotifications = async (req: AuthRequest, res: express.Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user!._id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const updateNotificationStatus = async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const notification = await Notification.findOne({ _id: id, userId: req.user!._id });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.status = status;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error updating notification' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: id, userId: req.user!._id });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting notification' });
  }
};
