import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateApplicationDto {
  @IsString()
  jobId!: string;

  @IsString()
  coverLetter!: string;

  @IsString()
  resume!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  expectedSalary?: number;

  @IsString()
  @IsOptional()
  expectedSalaryCurrency?: string = "USD";

  @IsEnum(["IMMEDIATE", "2_WEEKS", "1_MONTH", "3_MONTHS", "NEGOTIABLE"])
  @IsOptional()
  availability?: "IMMEDIATE" | "2_WEEKS" | "1_MONTH" | "3_MONTHS" | "NEGOTIABLE" = "NEGOTIABLE";

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateApplicationStatusDto {
  @IsEnum(["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"])
  status!: "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";

  @IsString()
  @IsOptional()
  employerNotes?: string;
}

export class ApplicationQueryDto {
  @IsEnum(["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"])
  @IsOptional()
  status?: "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";

  @IsString()
  @IsOptional()
  jobId?: string;

  @IsString()
  @IsOptional()
  candidateId?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  limit?: number = 10;
}
