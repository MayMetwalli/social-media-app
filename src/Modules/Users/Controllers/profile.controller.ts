import { Router, Request, Response } from "express";
import profileService from "../Services/profile.service";
import multer from "multer";

const upload = multer();
const router = Router();

router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      await profileService.uploadProfilePicture(req, res);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Upload failed" });
    }
  }
);

router.get("/:key", async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const stream = await profileService.getProfilePicStream(key);
    stream.pipe(res);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Download failed" });
  }
});

router.delete("/:key", async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    if (!key) return res.status(400).json({ error: "Missing key" });

    await profileService.deleteProfilePicture(key);
    res.json({ message: "Profile picture deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Delete failed" });
  }
});

export default router;
