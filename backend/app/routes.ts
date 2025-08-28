import express from "express";
import userRoutes from "./user/user.route";
import jobRoutes from "./job/job.route";
import applicationRoutes from "./application/application.route";

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);

export default router;