import { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { toast } from 'react-toastify';

interface Notification {
    _id: string;
    japaneseWord: string;
    englishMeaning: string;
    marathiMeaning: string;
    reminderTime: string;
    status: 'active' | 'inactive';
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newNotification, setNewNotification] = useState({
        japaneseWord: '',
        englishMeaning: '',
        marathiMeaning: '',
        reminderTime: '',
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error: any) {
            toast.error('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await notificationService.createNotification(newNotification);
            setNotifications([...notifications, response]);
            setNewNotification({
                japaneseWord: '',
                englishMeaning: '',
                marathiMeaning: '',
                reminderTime: '',
            });
            toast.success('Notification created successfully!');
        } catch (error: any) {
            toast.error('Failed to create notification');
        }
    };

    const toggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await notificationService.updateNotificationStatus(id, newStatus);
            setNotifications(
                notifications.map((notification) =>
                    notification._id === id
                        ? { ...notification, status: newStatus }
                        : notification
                )
            );
            toast.success('Status updated successfully!');
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(notifications.filter((notification) => notification._id !== id));
            toast.success('Notification deleted successfully!');
        } catch (error: any) {
            toast.error('Failed to delete notification');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Create New Notification</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="japaneseWord">Japanese Word</label>
                        <input
                            type="text"
                            id="japaneseWord"
                            value={newNotification.japaneseWord}
                            onChange={(e) =>
                                setNewNotification({ ...newNotification, japaneseWord: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="englishMeaning">English Meaning</label>
                        <input
                            type="text"
                            id="englishMeaning"
                            value={newNotification.englishMeaning}
                            onChange={(e) =>
                                setNewNotification({ ...newNotification, englishMeaning: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="marathiMeaning">Marathi Meaning</label>
                        <input
                            type="text"
                            id="marathiMeaning"
                            value={newNotification.marathiMeaning}
                            onChange={(e) =>
                                setNewNotification({ ...newNotification, marathiMeaning: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reminderTime">Reminder Time (HH:mm)</label>
                        <input
                            type="time"
                            id="reminderTime"
                            value={newNotification.reminderTime}
                            onChange={(e) =>
                                setNewNotification({ ...newNotification, reminderTime: e.target.value })
                            }
                            required
                        />
                    </div>
                    <button type="submit" className="btn">
                        Create Notification
                    </button>
                </form>
            </div>

            <h2>Your Notifications</h2>
            <div className="notifications-list">
                {notifications.map((notification) => (
                    <div key={notification._id} className="notification-card">
                        <h3>{notification.japaneseWord}</h3>
                        <p>English: {notification.englishMeaning}</p>
                        <p>Marathi: {notification.marathiMeaning}</p>
                        <p>Time: {notification.reminderTime}</p>
                        <p>Status: {notification.status}</p>
                        <div className="actions">
                            <button
                                onClick={() => toggleStatus(notification._id, notification.status)}
                                className="btn"
                            >
                                {notification.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                            <button
                                onClick={() => deleteNotification(notification._id)}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
