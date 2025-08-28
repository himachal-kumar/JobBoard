"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = require("./job.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes (no authentication required)
router.get("/search", job_controller_1.JobController.searchJobs);
router.get("/test", job_controller_1.JobController.testSearch);
router.get("/:jobId", job_controller_1.JobController.getJobById);
// Protected routes (authentication required)
router.use(auth_middleware_1.authenticateToken);
// Employer-only routes
router.post("/", auth_middleware_1.requireEmployer, job_controller_1.JobController.createJob);
router.put("/:jobId", auth_middleware_1.requireEmployer, job_controller_1.JobController.updateJob);
router.delete("/:jobId", auth_middleware_1.requireEmployer, job_controller_1.JobController.deleteJob);
router.get("/employer/jobs", auth_middleware_1.requireEmployer, job_controller_1.JobController.getJobsByEmployer);
router.get("/employer/stats", auth_middleware_1.requireEmployer, job_controller_1.JobController.getJobStats);
router.patch("/:jobId/close", auth_middleware_1.requireEmployer, job_controller_1.JobController.closeJob);
router.patch("/:jobId/reopen", auth_middleware_1.requireEmployer, job_controller_1.JobController.reopenJob);
exports.default = router;
