import express from 'express';
import * as NotificationController from '../controllers/NotificationController';
import auth from '../middleware/auth';

const router = express.Router();

// All routes are protected by auth middleware
router.use(auth);

router.post('/', NotificationController.createNotification);
router.get('/', NotificationController.getUserNotifications);
router.patch('/:id/status', NotificationController.updateNotificationStatus);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
