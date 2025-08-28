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
exports.JobQueryDto = exports.UpdateJobDto = exports.CreateJobDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateJobDto {
    constructor() {
        this.salaryCurrency = "USD";
        this.remote = false;
    }
}
exports.CreateJobDto = CreateJobDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "responsibilities", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    __metadata("design:type", String)
], CreateJobDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"]),
    __metadata("design:type", String)
], CreateJobDto.prototype, "experience", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "salaryMin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "salaryMax", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "salaryCurrency", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "benefits", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], CreateJobDto.prototype, "remote", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "deadline", void 0);
class UpdateJobDto {
}
exports.UpdateJobDto = UpdateJobDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateJobDto.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateJobDto.prototype, "responsibilities", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "experience", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? Number(value) : undefined),
    __metadata("design:type", Number)
], UpdateJobDto.prototype, "salaryMin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? Number(value) : undefined),
    __metadata("design:type", Number)
], UpdateJobDto.prototype, "salaryMax", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "salaryCurrency", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateJobDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateJobDto.prototype, "benefits", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], UpdateJobDto.prototype, "remote", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "deadline", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["ACTIVE", "CLOSED", "DRAFT"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobDto.prototype, "status", void 0);
class JobQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.JobQueryDto = JobQueryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobQueryDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobQueryDto.prototype, "experience", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], JobQueryDto.prototype, "remote", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 1),
    __metadata("design:type", Number)
], JobQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 10),
    __metadata("design:type", Number)
], JobQueryDto.prototype, "limit", void 0);
