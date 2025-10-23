import { Router, Request, Response } from "express";
import userService from "../Services/user.service";
import { authentication } from "../../../Middleware";
import { cloudFileUpload, fileValidation, StorageEnum } from "../../../Utils/multer/multer";

const router = Router();

router.get("/profile", authentication, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.body.userId;
    const data = await userService.getProfile(userId);
    res.json({ message: "Profile fetched", ...data });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.patch(
  "/profile-image",
  authentication,
  cloudFileUpload({
    storageApproach: StorageEnum.MEMORY,
    validation: fileValidation.images,
  }).single("attachment"),
  async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const file = req.file;

      const updatedUser = await userService.updateProfilePicture(userId, file!);
      res.json({ message: "Profile picture updated", user: updatedUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put("/update-info", authentication, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.body.userId;
    const { name, bio } = req.body;
    const user = await userService.updateBasicInfo(userId, { name, bio });
    res.json({ message: "Info updated", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Bad request" });
  }
});

router.put("/update-password", authentication, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.body.userId;
    const { oldPassword, newPassword } = req.body;
    const result = await userService.updatePassword(userId, oldPassword, newPassword);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Bad request" });
  }
});

router.put("/update-email", authentication, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.body.userId;
    const { newEmail } = req.body;
    const user = await userService.updateEmail(userId, newEmail);
    res.json({ message: "Email updated", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Bad request" });
  }
});

router.put("/block/:userId", authentication, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
const result = await userService.blockUser(userId!);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/unblock/:userId", authentication, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await userService.unblockUser(userId!);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/friend-request/:requestId", authentication, async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    if (!requestId) return res.status(400).json({ message: "Request ID is required" });

    const result = await userService.deleteFriendRequest(requestId);
    res.status(200).json({ message: "Friend request deleted", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/unfriend/:friendId", authentication, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const { friendId } = req.params;

    if (!friendId) return res.status(400).json({ message: "Friend ID is required" });

    const result = await userService.unFriend(userId, friendId);
    res.status(200).json({ message: "User unfriended", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



export default router;

