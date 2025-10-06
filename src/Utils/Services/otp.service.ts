import OtpModel from "../../DB/Models/otp.model";
import { OtpTypesEnum } from "../../Common";

class OtpService {
  async generateOtp(email: string, otpType: OtpTypesEnum): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OtpModel.create({ email, otp, type: otpType, createdAt: new Date() });
    return otp;
  }

  async verifyOtp(email: string, otp: string, otpType: OtpTypesEnum): Promise<boolean> {
    const record = await OtpModel.findOne({ email, otp, type: otpType });
    if (!record) return false;
    await OtpModel.deleteOne({ _id: record._id });
    return true;
  }
}

export default new OtpService();
