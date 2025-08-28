import { IsString, IsArray, IsNumber, IsEnum, IsBoolean, IsOptional, IsDateString, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

export class CreateJobDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  requirements!: string[];

  @IsArray()
  @IsString({ each: true })
  responsibilities!: string[];

  @IsString()
  company!: string;

  @IsString()
  location!: string;

  @IsEnum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
  type!: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

  @IsEnum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"])
  experience!: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  salaryMin!: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  salaryMax!: number;

  @IsString()
  @IsOptional()
  salaryCurrency?: string = "USD";

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  remote?: boolean = false;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
  @IsOptional()
  type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

  @IsEnum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"])
  @IsOptional()
  experience?: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : undefined)
  salaryMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : undefined)
  salaryMax?: number;

  @IsString()
  @IsOptional()
  salaryCurrency?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  remote?: boolean;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsEnum(["ACTIVE", "CLOSED", "DRAFT"])
  @IsOptional()
  status?: "ACTIVE" | "CLOSED" | "DRAFT";
}

export class JobQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
  @IsOptional()
  type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

  @IsEnum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"])
  @IsOptional()
  experience?: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  remote?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  limit?: number = 10;
}
