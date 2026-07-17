import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  category: 'info' | 'warning' | 'feature' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  createdAt: Date;
  createdBy: string;
}

const AnnouncementSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, enum: ['info', 'warning', 'feature', 'maintenance'], default: 'info' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'System Admin' },
});

export const AnnouncementModel = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
