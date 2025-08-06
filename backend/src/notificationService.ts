import dotenv from 'dotenv';
import cron from 'node-cron';
import mongoose from 'mongoose';
import Notification from './models/Notification.ts';
import EmailService from './services/EmailService.ts';
import './models/User.ts';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB connected for notification service'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to send notifications
async function sendNotifications() {
  try {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Find all active notifications scheduled for current time
    const notifications = await Notification.find({
      status: 'active',
      reminderTime: currentTime
    }).populate('userId');

    for (const notification of notifications) {
      const user = notification.userId as any;
      
      try {
        await EmailService.sendDailyWord(
          user.email,
          notification.japaneseWord,
          notification.englishMeaning,
          notification.marathiMeaning
        );
        console.log(`Notification sent to ${user.email}`);
      } catch (error) {
        console.error(`Error sending notification to ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in sendNotifications:', error);
  }
}

// Schedule the notification check every minute
cron.schedule('* * * * *', sendNotifications);

console.log('Notification service started');
