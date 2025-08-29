import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  active?: boolean;
  role: "EMPLOYER" | "CANDIDATE" | "ADMIN";
  password?: string;
  refreshToken?: string;
  blocked?: boolean;
  blockReason?: string;
  provider: ProviderType;
  facebookId?: string;
  image?: string;
  linkedinId?: string;
  // Additional fields for role-based data
  phone?: string;
  mobile?: string; // Add mobile field
  location?: string;
  company?: string;
  position?: string;
  skills?: string[];
}

// Interface for user with password (used during authentication)
export interface IUserWithPassword extends IUser {
  password: string;
}

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}
