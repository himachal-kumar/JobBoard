import { ProjectionType, QueryOptions } from "mongoose";
import bcrypt from "bcrypt";
import { type IUser, type IUserWithPassword } from "./user.dto";
import UserSchema from "./user.schema";
import { JWTService } from "../common/services/jwt.service";

/**
 * Creates a new user
 * @param data user data, without _id, createdAt, and updatedAt fields
 * @returns a new user object, without password and refreshToken
 */
export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
  const result = await UserSchema.create(data);
  const { refreshToken, password, ...user } = result.toJSON();
  return user;
}; 

/**
 * Authenticates a user with email and password
 * @param email user email
 * @param password user password
 * @returns user object with tokens or null if authentication fails
 */
export const authenticateUser = async (email: string, password: string) => {
  const user = await UserSchema.findOne({ email }).select("+password") as IUserWithPassword | null;
  
  if (!user || user.blocked || !user.password) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  // Generate tokens
  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const tokens = JWTService.generateTokenPair(tokenPayload);
  
  // Save refresh token to database
  await UserSchema.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken
  });

  const { password: _, refreshToken: __, ...userWithoutSensitive } = (user as any).toJSON();
  
  return {
    user: userWithoutSensitive,
    tokens
  };
};

/**
 * Refreshes access token using refresh token
 * @param refreshToken the refresh token
 * @returns new tokens or null if refresh fails
 */
export const refreshUserToken = async (refreshToken: string) => {
  try {
    const payload = JWTService.verifyRefreshToken(refreshToken);
    
    const user = await UserSchema.findById(payload.userId).select("+refreshToken");
    
    if (!user || user.blocked || user.refreshToken !== refreshToken) {
      return null;
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const newTokens = JWTService.generateTokenPair(tokenPayload);
    
    // Update refresh token in database
    await UserSchema.findByIdAndUpdate(user._id, {
      refreshToken: newTokens.refreshToken
    });

    return newTokens;
  } catch (error) {
    return null;
  }
};

/**
 * Logs out a user by invalidating their refresh token
 * @param userId the user ID
 * @returns true if logout successful
 */
export const logoutUser = async (userId: string): Promise<boolean> => {
  try {
    await UserSchema.findByIdAndUpdate(userId, { refreshToken: "" });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Updates a user
 * @param id user id
 * @param data user data to update, without _id, createdAt, and updatedAt fields
 * @returns the updated user object, without password and refreshToken
 */
export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

/**
 * Updates a user, with a subset of fields
 * @param id user id
 * @param data user data to update, with only the fields that should be updated
 * @returns the updated user object, without password and refreshToken
 */
export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne(
    { _id: id },
    { select: "-password -refreshToken -facebookId" }
  );
  return result;
};

/**
 * Finds a user by ID
 * @param id the user ID
 * @param projection optional mongoose projection to select only some fields
 * @returns the user object, without password and refreshToken fields, or null if not found
 */
export const getUserById = async (
  id: string,
  projection?: ProjectionType<IUser>
) => {
  const result = await UserSchema.findById(id, projection).lean();
  return result;
};

/**
 * Gets all users
 * @param projection optional mongoose projection to select only some fields
 * @param options optional mongoose query options
 * @returns a list of user objects, without password and refreshToken fields
 */

export const getAllUser = async (
  projection?: ProjectionType<IUser>,
  options?: QueryOptions<IUser>
) => {
  const result = await UserSchema.find({}, projection, options).lean();
  return result;
};
/**
 * Finds a user by email
 * @param email the email to search for
 * @param projection optional mongoose projection to select only some fields
 * @returns the user object, without password and refreshToken fields, or null if not found
 */
export const getUserByEmail = async (
  email: string,
  projection?: ProjectionType<IUser>
) => {
  const result = await UserSchema.findOne({ email }, projection).lean();
  return result;
};

/**
 * Counts the total number of users in the database
 * @returns a promise that resolves with the number of users
 */
export const countItems = () => {
  return UserSchema.count();
};
