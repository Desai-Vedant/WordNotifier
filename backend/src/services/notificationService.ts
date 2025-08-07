import Notification from '../models/Notification';
import EmailService from './EmailService';
import '../models/User';


// Function to send notifications
export async function sendNotifications() {
  try {
    const fmt = new Intl.DateTimeFormat(
      'en-US', 
      { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }
    )
    const now = new Date();
    const currentTime = fmt.format(now);

    // Find all active notifications scheduled for current time
    const notifications = await Notification.find({
      status: 'active',
      reminderTime: currentTime
    }).populate('userId');

    if (notifications.length === 0) {
      console.log('No notifications to send at this time');
      return 0;
    }

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

    return notifications.length;
  } catch (error) {
    console.error('Error in sendNotifications:', error);
  }
}