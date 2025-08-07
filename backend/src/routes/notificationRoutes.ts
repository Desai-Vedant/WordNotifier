import express from 'express';
import * as NotificationController from '../controllers/NotificationController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/send-reminders', NotificationController.sendReminders);

router.post('/', auth, NotificationController.createNotification);
router.get('/', auth, NotificationController.getUserNotifications);
router.patch('/:id/status', auth, NotificationController.updateNotificationStatus);
router.delete('/:id', auth, NotificationController.deleteNotification);

export default router;
