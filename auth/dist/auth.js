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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth = exports.AuthZeroProvider = void 0;
exports.createAuthClient = createAuthClient;
exports.createCustomClient = createCustomClient;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
class AuthZeroProvider extends types_1.AuthProvider {
    constructor(config) {
        super();
        this.config = config;
    }
    generateAuthUrl() {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.config.client_id,
            redirect_uri: this.config.redirect_uri,
            scope: this.config.scope
        }).toString();
        return `https://${this.config.domain}/authorize?${params}`;
    }
    exchangeCodeForToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenEndPoint = `https://${this.config.domain}/oauth/token`;
            const payload = {
                grant_type: 'authorization_code',
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                code,
                redirect_uri: this.config.redirect_uri,
                scope: this.config.scope
            };
            try {
                const response = yield axios_1.default.post(tokenEndPoint, payload);
                const { access_token, id_token, refresh_token } = response.data;
                return access_token;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserData(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfoEndpoint = `https://${this.config.domain}/userinfo`;
            try {
                const response = yield axios_1.default.get(userInfoEndpoint, {
                    params: {
                        scope: this.config.scope
                    },
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                return response.data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateRefreshToken(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenEndpoint = `https://${this.config.domain}/oauth/token`;
            const payload = {
                grant_type: 'refresh_token',
                client_id: this.config.client_id,
                refresh_token
            };
            try {
                const response = yield axios_1.default.post(tokenEndpoint, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthZeroProvider = AuthZeroProvider;
class OAuth {
    constructor(authProvider) {
        this.authProvider = authProvider;
    }
    startAuthFlow() {
        return this.authProvider.generateAuthUrl();
    }
    handleCallback(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authProvider.exchangeCodeForToken(code);
        });
    }
    getUserInfo(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authProvider.getUserData(access_token);
        });
    }
    refreshToken(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authProvider.generateRefreshToken(refresh_token);
        });
    }
}
exports.OAuth = OAuth;
function createAuthClient(config) {
    return new OAuth(new AuthZeroProvider(config));
}
function createCustomClient(customProvider) {
    return new OAuth(customProvider);
}
//# sourceMappingURL=auth.js.map