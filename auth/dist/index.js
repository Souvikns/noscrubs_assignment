var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Auth = exports.Provider = void 0;
    exports.createAuthClient = createAuthClient;
    class Provider {
        constructor(config) {
            this.config = config;
        }
        startAuthFlow() {
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: this.config.client_id,
                redirect_uri: this.config.redirect_uri,
                scope: this.config.scope
            }).toString();
            return `https://${this.config.domain}/authorize?${params}`;
        }
        handleCallback(code) {
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
                    const res = yield fetch(tokenEndPoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = yield res.json();
                    console.log(data);
                    const { access_token, id_token, refresh_token } = data;
                    return access_token;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        refreshToken(refresh_token) {
            return __awaiter(this, void 0, void 0, function* () {
                const tokenEndpoint = `https://${this.config.domain}/oauth/token`;
                const payload = {
                    grant_type: 'refresh_token',
                    client_id: this.config.client_id,
                    refresh_token
                };
                try {
                    const res = yield fetch(tokenEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = yield res.json();
                    return data;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        getUserInfo(access_token) {
            return __awaiter(this, void 0, void 0, function* () {
                const userInfoEndpoint = `https://${this.config.domain}/userinfo`;
                try {
                    const res = yield fetch(userInfoEndpoint, {
                        method: 'Get',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = yield res.json();
                    return data;
                }
                catch (error) {
                    throw error;
                }
            });
        }
    }
    exports.Provider = Provider;
    class Auth extends Provider {
    }
    exports.Auth = Auth;
    function createAuthClient(config) {
        return new Auth(config);
    }
});
//# sourceMappingURL=index.js.map