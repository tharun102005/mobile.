import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: string;
  adminEmail: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  adminId: { type: String, required: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  targetResource: { type: String, required: true },
  details: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
