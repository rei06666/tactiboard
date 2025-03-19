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
exports.passwordChangeCognito = exports.sendVerificationCognito = exports.signInCognito = exports.signUpCognito = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const crypto_1 = __importDefault(require("crypto"));
const getSecretHash = (username) => {
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const hmac = crypto_1.default.createHmac("sha256", clientSecret);
    hmac.update(username + clientId);
    return hmac.digest("base64");
};
const cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
});
// ユーザーのサインアップ
const signUpCognito = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = user;
        const secretHash = getSecretHash(name);
        // ユーザーのサインアップ
        const signUpCommand = new client_cognito_identity_provider_1.SignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: name,
            Password: password,
            UserAttributes: [
                { Name: "email", Value: email }
            ],
            SecretHash: secretHash
        });
        yield cognitoClient.send(signUpCommand);
        // 管理者によるサインアップの確認
        const adminConfirmCommand = new client_cognito_identity_provider_1.AdminConfirmSignUpCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: name
        });
        yield cognitoClient.send(adminConfirmCommand);
        // メールアドレスを確認済みに設定
        const updateAttributesCommand = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: name,
            UserAttributes: [
                { Name: "email_verified", Value: "true" }
            ]
        });
        yield cognitoClient.send(updateAttributesCommand);
        return "ok";
    }
    catch (error) {
        console.error("Error signing up user:", error.message);
        throw error;
    }
});
exports.signUpCognito = signUpCognito;
// ユーザーのサインイン
const signInCognito = (name, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ユーザーのサインイン
        const signInCommand = new client_cognito_identity_provider_1.InitiateAuthCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {
                USERNAME: name,
                PASSWORD: password,
                SECRET_HASH: getSecretHash(name)
            }
        });
        const signInResponse = yield cognitoClient.send(signInCommand);
        // アクセストークンを取得
        const accessToken = signInResponse.AuthenticationResult.AccessToken;
        return accessToken;
    }
    catch (error) {
        console.error("Error signing in user:", error);
        throw error;
    }
});
exports.signInCognito = signInCognito;
// パスワードのリセット
const sendVerificationCognito = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_cognito_identity_provider_1.ForgotPasswordCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: name,
            SecretHash: getSecretHash(name)
        });
        yield cognitoClient.send(command);
    }
    catch (error) {
        console.error("Error send verification:", error);
        throw error;
    }
});
exports.sendVerificationCognito = sendVerificationCognito;
// パスワードの変更
const passwordChangeCognito = (name, newPassword, verifyCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_cognito_identity_provider_1.ConfirmForgotPasswordCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: name,
            Password: newPassword,
            SecretHash: getSecretHash(name),
            ConfirmationCode: verifyCode
        });
        yield cognitoClient.send(command);
    }
    catch (error) {
        console.error("Error send verification:", error);
        throw error;
    }
});
exports.passwordChangeCognito = passwordChangeCognito;
