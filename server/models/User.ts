import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  avatarUrl?: string;
  lastLogin: Date;
  registeredAt: Date;
  deviceInfo?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  avatarUrl: { type: String },
  lastLogin: { type: Date, default: Date.now },
  registeredAt: { type: Date, default: Date.now },
  deviceInfo: { type: String, default: 'Web Browser / Native PWA' },
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
