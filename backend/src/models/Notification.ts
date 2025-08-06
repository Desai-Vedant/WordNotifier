import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  japaneseWord: string;
  englishMeaning: string;
  marathiMeaning: string;
  reminderTime: string;
  status: 'active' | 'inactive';
}

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  japaneseWord: {
    type: String,
    required: true,
    trim: true
  },
  englishMeaning: {
    type: String,
    required: true,
    trim: true
  },
  marathiMeaning: {
    type: String,
    required: true,
    trim: true
  },
  reminderTime: {
    type: String,
    required: true,
    // Store time in 24-hour format (HH:mm)
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', notificationSchema);
