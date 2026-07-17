import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  submittedAt: Date;
}

const ContactSubmissionSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'resolved'], default: 'unread' },
  submittedAt: { type: Date, default: Date.now },
});

export const ContactSubmissionModel = mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
