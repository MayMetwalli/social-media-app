import mongoose, { Schema, Document } from "mongoose";
import { OtpTypesEnum } from "../../Common"; 


export interface IOtp extends Document {
  email: string;
  otp: string;
  type: OtpTypesEnum;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: { type: String, enum: Object.values(OtpTypesEnum), required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, 
});

const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);

export default OtpModel;
