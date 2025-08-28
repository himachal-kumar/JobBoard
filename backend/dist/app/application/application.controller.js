"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("./application.service");
const application_dto_1 = require("./application.dto");
const class_validator_1 = require("class-validator");
class ApplicationController {
    static createApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const applicationData = new application_dto_1.CreateApplicationDto();
                Object.assign(applicationData, req.body);
                const errors = yield (0, class_validator_1.validate)(applicationData);
                if (errors.length > 0) {
                    res.status(400).json({
                        message: "Validation failed",
                        errors: errors.map(error => ({
                            field: error.property,
                            message: Object.values(error.constraints || {}).join(", ")
                        }))
                    });
                    return;
                }
                const application = yield application_service_1.ApplicationService.createApplication(applicationData, req.user._id);
                res.status(201).json({
                    message: "Application submitted successfully",
                    data: application
                });
            }
            catch (error) {
                res.status(400).json({
                    message: "Failed to submit application",
                    error: error.message
                });
            }
        });
    }
    static updateApplicationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                const updateData = new application_dto_1.UpdateApplicationStatusDto();
                Object.assign(updateData, req.body);
                const errors = yield (0, class_validator_1.validate)(updateData);
                if (errors.length > 0) {
                    res.status(400).json({
                        message: "Validation failed",
                        errors: errors.map(error => ({
                            field: error.property,
                            message: Object.values(error.constraints || {}).join(", ")
                        }))
                    });
                    return;
                }
                const application = yield application_service_1.ApplicationService.updateApplicationStatus(applicationId, updateData, req.user._id);
                if (!application) {
                    res.status(404).json({ message: "Application not found or access denied" });
                    return;
                }
                res.json({
                    message: "Application status updated successfully",
                    data: application
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to update application status",
                    error: error.message
                });
            }
        });
    }
    static getApplicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                const application = yield application_service_1.ApplicationService.getApplicationById(applicationId, req.user._id, req.user.role);
                if (!application) {
                    res.status(404).json({ message: "Application not found or access denied" });
                    return;
                }
                res.json({
                    message: "Application retrieved successfully",
                    data: application
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve application",
                    error: error.message
                });
            }
        });
    }
    static getApplicationsByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = new application_dto_1.ApplicationQueryDto();
                Object.assign(query, req.query);
                const errors = yield (0, class_validator_1.validate)(query);
                if (errors.length > 0) {
                    res.status(400).json({
                        message: "Validation failed",
                        errors: errors.map(error => ({
                            field: error.property,
                            message: Object.values(error.constraints || {}).join(", ")
                        }))
                    });
                    return;
                }
                const result = yield application_service_1.ApplicationService.getApplicationsByCandidate(req.user._id, query);
                res.json({
                    message: "Applications retrieved successfully",
                    data: result.applications,
                    pagination: {
                        page: query.page || 1,
                        limit: query.limit || 10,
                        total: result.total,
                        pages: Math.ceil(result.total / (query.limit || 10))
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve applications",
                    error: error.message
                });
            }
        });
    }
    static getApplicationsByEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = new application_dto_1.ApplicationQueryDto();
                Object.assign(query, req.query);
                const errors = yield (0, class_validator_1.validate)(query);
                if (errors.length > 0) {
                    res.status(400).json({
                        message: "Validation failed",
                        errors: errors.map(error => ({
                            field: error.property,
                            message: Object.values(error.constraints || {}).join(", ")
                        }))
                    });
                    return;
                }
                const result = yield application_service_1.ApplicationService.getApplicationsByEmployer(req.user._id, query);
                res.json({
                    message: "Applications retrieved successfully",
                    data: result.applications,
                    pagination: {
                        page: query.page || 1,
                        limit: query.limit || 10,
                        total: result.total,
                        pages: Math.ceil(result.total / (query.limit || 10))
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve applications",
                    error: error.message
                });
            }
        });
    }
    static getApplicationStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield application_service_1.ApplicationService.getApplicationStats(req.user._id);
                res.json({
                    message: "Application statistics retrieved successfully",
                    data: stats
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve application statistics",
                    error: error.message
                });
            }
        });
    }
    static withdrawApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                const withdrawn = yield application_service_1.ApplicationService.withdrawApplication(applicationId, req.user._id);
                if (!withdrawn) {
                    res.status(404).json({ message: "Application not found or cannot be withdrawn" });
                    return;
                }
                res.json({ message: "Application withdrawn successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to withdraw application",
                    error: error.message
                });
            }
        });
    }
}
exports.ApplicationController = ApplicationController;
