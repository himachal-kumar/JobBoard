"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyToken = exports.decodeToken = exports.createUserTokens = exports.initPassport = exports.isValidPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const userService = __importStar(require("../../user/user.service"));
const jwt_service_1 = require("./jwt.service");
/**
 * Compare a given password with a hashed password
 *
 * @param {string} value - The password to compare
 * @param {string} password - The hashed password to compare with
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise
 */
const isValidPassword = function (value, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const compare = yield bcrypt_1.default.compare(value, password);
        return compare;
    });
};
exports.isValidPassword = isValidPassword;
/**
 * Initialize passport with JWT and Local Strategies
 *
 * @returns {void} - Nothing
 */
const initPassport = () => {
    passport_1.default.use(new passport_jwt_1.Strategy({
        secretOrKey: jwt_service_1.JWTService.getJwtSecret(),
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            done(null, token.user);
        }
        catch (error) {
            done(error);
        }
    })));
    // user login
    passport_1.default.use("login", new passport_local_1.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userService.getUserByEmail(email, {
                password: true,
                name: true,
                email: true,
                active: true,
                role: true,
                provider: true,
                phone: true,
                location: true,
                company: true,
                position: true,
                skills: true,
                image: true,
            });
            if (user == null) {
                done((0, http_errors_1.default)(401, "User not found!"), false);
                return;
            }
            if (!user.active) {
                done((0, http_errors_1.default)(401, "User is inactive"), false);
                return;
            }
            if (user.blocked) {
                done((0, http_errors_1.default)(401, "User is blocked, Contact to admin"), false);
                return;
            }
            const validate = yield (0, exports.isValidPassword)(password, user.password);
            if (!validate) {
                done((0, http_errors_1.default)(401, "Invalid email or password"), false);
                return;
            }
            const { password: _p } = user, result = __rest(user, ["password"]);
            done(null, result, { message: "Logged in Successfully" });
        }
        catch (error) {
            done((0, http_errors_1.default)(500, error.message));
        }
    })));
};
exports.initPassport = initPassport;
const createUserTokens = (user) => {
    const accessToken = jwt_service_1.JWTService.generateAccessToken({
        userId: user._id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = jwt_service_1.JWTService.generateRefreshToken({
        userId: user._id,
        email: user.email,
        role: user.role,
    });
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
const decodeToken = (token) => {
    const decode = jsonwebtoken_1.default.decode(token);
    const expired = dayjs_1.default.unix(decode.exp).isBefore((0, dayjs_1.default)());
    return Object.assign(Object.assign({}, decode), { expired });
};
exports.decodeToken = decodeToken;
const verifyToken = (token) => {
    try {
        return jwt_service_1.JWTService.verifyAccessToken(token);
    }
    catch (error) {
        throw new Error("Invalid token");
    }
};
exports.verifyToken = verifyToken;
