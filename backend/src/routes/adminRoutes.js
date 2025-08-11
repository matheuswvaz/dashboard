import express from "express";
import * as adminController from "../controllers/adminController.js";
import authenticateAdmin from "../middlewares/authMiddleware.js";
import upload from "../config/upload.js";

const router = express.Router();

router.get("/user-data", authenticateAdmin, adminController.getUserData);
router.get(
  "/visitor-stats",
  authenticateAdmin,
  adminController.getVisitorStats
);
router.get("/leads", authenticateAdmin, adminController.getLeads);
router.post(
  "/profile/photo",
  authenticateAdmin,
  upload.single("profilePhoto"),
  adminController.updateProfilePhoto
);

router.get("/map-data", authenticateAdmin, adminController.getMapData);

router.delete(
  "/profile/photo",
  authenticateAdmin,
  adminController.removeProfilePhoto
);
router.put("/profile", authenticateAdmin, adminController.updateUserProfile);
router.put(
  "/profile/password",
  authenticateAdmin,
  adminController.updateUserPassword
);

export default router;
