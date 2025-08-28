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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countItems = exports.getUserByEmail = exports.getAllUser = exports.getUserById = exports.deleteUser = exports.editUser = exports.updateUser = exports.logoutUser = exports.refreshUserToken = exports.authenticateUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = __importDefault(require("./user.schema"));
const jwt_service_1 = require("../common/services/jwt.service");
/**
 * Creates a new user
 * @param data user data, without _id, createdAt, and updatedAt fields
 * @returns a new user object, without password and refreshToken
 */
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.create(data);
    const _a = result.toJSON(), { refreshToken, password } = _a, user = __rest(_a, ["refreshToken", "password"]);
    return user;
});
exports.createUser = createUser;
/**
 * Authenticates a user with email and password
 * @param email user email
 * @param password user password
 * @returns user object with tokens or null if authentication fails
 */
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.default.findOne({ email }).select("+password");
    if (!user || user.blocked || !user.password) {
        return null;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    // Generate tokens
    const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    const tokens = jwt_service_1.JWTService.generateTokenPair(tokenPayload);
    // Save refresh token to database
    yield user_schema_1.default.findByIdAndUpdate(user._id, {
        refreshToken: tokens.refreshToken
    });
    const _a = user.toJSON(), { password: _, refreshToken: __ } = _a, userWithoutSensitive = __rest(_a, ["password", "refreshToken"]);
    return {
        user: userWithoutSensitive,
        tokens
    };
});
exports.authenticateUser = authenticateUser;
/**
 * Refreshes access token using refresh token
 * @param refreshToken the refresh token
 * @returns new tokens or null if refresh fails
 */
const refreshUserToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = jwt_service_1.JWTService.verifyRefreshToken(refreshToken);
        const user = yield user_schema_1.default.findById(payload.userId).select("+refreshToken");
        if (!user || user.blocked || user.refreshToken !== refreshToken) {
            return null;
        }
        // Generate new tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const newTokens = jwt_service_1.JWTService.generateTokenPair(tokenPayload);
        // Update refresh token in database
        yield user_schema_1.default.findByIdAndUpdate(user._id, {
            refreshToken: newTokens.refreshToken
        });
        return newTokens;
    }
    catch (error) {
        return null;
    }
});
exports.refreshUserToken = refreshUserToken;
/**
 * Logs out a user by invalidating their refresh token
 * @param userId the user ID
 * @returns true if logout successful
 */
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_schema_1.default.findByIdAndUpdate(userId, { refreshToken: "" });
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.logoutUser = logoutUser;
/**
 * Updates a user
 * @param id user id
 * @param data user data to update, without _id, createdAt, and updatedAt fields
 * @returns the updated user object, without password and refreshToken
 */
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOneAndUpdate({ _id: id }, data, {
        new: true,
        select: "-password -refreshToken -facebookId",
    });
    return result;
});
exports.updateUser = updateUser;
/**
 * Updates a user, with a subset of fields
 * @param id user id
 * @param data user data to update, with only the fields that should be updated
 * @returns the updated user object, without password and refreshToken
 */
const editUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOneAndUpdate({ _id: id }, data, {
        new: true,
        select: "-password -refreshToken -facebookId",
    });
    return result;
});
exports.editUser = editUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.deleteOne({ _id: id }, { select: "-password -refreshToken -facebookId" });
    return result;
});
exports.deleteUser = deleteUser;
/**
 * Finds a user by ID
 * @param id the user ID
 * @param projection optional mongoose projection to select only some fields
 * @returns the user object, without password and refreshToken fields, or null if not found
 */
const getUserById = (id, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findById(id, projection).lean();
    return result;
});
exports.getUserById = getUserById;
/**
 * Gets all users
 * @param projection optional mongoose projection to select only some fields
 * @param options optional mongoose query options
 * @returns a list of user objects, without password and refreshToken fields
 */
const getAllUser = (projection, options) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.find({}, projection, options).lean();
    return result;
});
exports.getAllUser = getAllUser;
/**
 * Finds a user by email
 * @param email the email to search for
 * @param projection optional mongoose projection to select only some fields
 * @returns the user object, without password and refreshToken fields, or null if not found
 */
const getUserByEmail = (email, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOne({ email }, projection).lean();
    return result;
});
exports.getUserByEmail = getUserByEmail;
/**
 * Counts the total number of users in the database
 * @returns a promise that resolves with the number of users
 */
const countItems = () => {
    return user_schema_1.default.count();
};
exports.countItems = countItems;
