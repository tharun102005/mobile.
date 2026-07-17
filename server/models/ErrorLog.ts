import mongoose, { Schema, Document } from 'mongoose';

export interface IErrorLog extends Document {
  level: 'error' | 'warn' | 'fatal';
  message: string;
  stackTrace?: string;
  source: string;
  timestamp: Date;
}

const ErrorLogSchema: Schema = new Schema({
  level: { type: String, enum: ['error', 'warn', 'fatal'], default: 'error' },
  message: { type: String, required: true },
  stackTrace: { type: String },
  source: { type: String, default: 'Client/PWA' },
  timestamp: { type: Date, default: Date.now },
});

export const ErrorLogModel = mongoose.models.ErrorLog || mongoose.model<IErrorLog>('ErrorLog', ErrorLogSchema);
