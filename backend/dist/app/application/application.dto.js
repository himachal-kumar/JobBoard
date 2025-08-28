"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationQueryDto = exports.UpdateApplicationStatusDto = exports.CreateApplicationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateApplicationDto {
    constructor() {
        this.expectedSalaryCurrency = "USD";
        this.availability = "NEGOTIABLE";
    }
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "coverLetter", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "resume", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "expectedSalary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "expectedSalaryCurrency", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["IMMEDIATE", "2_WEEKS", "1_MONTH", "3_MONTHS", "NEGOTIABLE"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "availability", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "notes", void 0);
class UpdateApplicationStatusDto {
}
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"]),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "employerNotes", void 0);
class ApplicationQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.ApplicationQueryDto = ApplicationQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplicationQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplicationQueryDto.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplicationQueryDto.prototype, "candidateId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 1),
    __metadata("design:type", Number)
], ApplicationQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 10),
    __metadata("design:type", Number)
], ApplicationQueryDto.prototype, "limit", void 0);
