"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.authenticateToken);
// Candidate routes
router.post("/", auth_middleware_1.requireCandidate, application_controller_1.ApplicationController.createApplication);
router.get("/candidate", auth_middleware_1.requireCandidate, application_controller_1.ApplicationController.getApplicationsByCandidate);
router.delete("/:applicationId/withdraw", auth_middleware_1.requireCandidate, application_controller_1.ApplicationController.withdrawApplication);
// Employer routes
router.get("/employer", auth_middleware_1.requireEmployer, application_controller_1.ApplicationController.getApplicationsByEmployer);
router.get("/employer/stats", auth_middleware_1.requireEmployer, application_controller_1.ApplicationController.getApplicationStats);
router.patch("/:applicationId/status", auth_middleware_1.requireEmployer, application_controller_1.ApplicationController.updateApplicationStatus);
// Shared routes (both candidates and employers can access their own applications)
router.get("/:applicationId", application_controller_1.ApplicationController.getApplicationById);
exports.default = router;
