import { Router, Request, Response } from "express";
import AuthService from "../Services/auth.service";
import { userModel } from "../../../DB/Models";
import otpService from "../../../Utils/Services/otp.service";
import emailService from "../../../Utils/Services/email.service"; 
import { OtpTypesEnum } from "../../../Common"; 

const router = Router()

router.post("/signup", AuthService.signUp);
router.post("/signIn", AuthService.SignIn);
router.post("/logout", AuthService.logout);
router.put("/confirmEmail", AuthService.confirmEmail);


router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = await otpService.generateOtp(email, OtpTypesEnum.PASSWORD_RESET);
    await emailService.sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your password reset OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp, type } = req.body;
    const otpType = (type as keyof typeof OtpTypesEnum) ? (OtpTypesEnum as any)[type] : OtpTypesEnum.PASSWORD_RESET;
    const ok = await otpService.verifyOtp(email, otp, otpType);
    if (!ok) return res.status(400).json({ message: "Invalid or expired OTP" });
    res.json({ message: "OTP verified" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const ok = await otpService.verifyOtp(email, otp, OtpTypesEnum.PASSWORD_RESET);
    if (!ok) return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await AuthService.resetPassword(email, newPassword); 
    res.json({ message: "Password reset successful" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/enable-2fa", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.body.userId;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = await otpService.generateOtp(user.email, OtpTypesEnum.TWO_FACTOR);
    await emailService.sendEmail({
      to: user.email,
      subject: "Enable Two-Factor Authentication",
      html: `<p>Your 2FA OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.json({ message: "2FA OTP sent to email" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/verify-2fa", async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await otpService.verifyOtp(user.email, otp, OtpTypesEnum.TWO_FACTOR);
    if (!ok) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.is2FAEnabled = true;
    await user.save();
    res.json({ message: "2FA enabled successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export { router as authController };
