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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerification = exports.changePassword = exports.signIn = exports.signUp = void 0;
const cognitoService_1 = require("../services/cognitoService");
// ユーザー登録
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        };
        const result = yield (0, cognitoService_1.signUpCognito)(user);
        const response = { message: 'ok' };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        res.status(500).json(response);
    }
});
exports.signUp = signUp;
// ログイン
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password } = req.body;
        const accessToken = yield (0, cognitoService_1.signInCognito)(name, password);
        const response = { message: 'ok', accessToken };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        res.status(500).json(response);
    }
});
exports.signIn = signIn;
// メールアドレス確認コード送信
const sendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        yield (0, cognitoService_1.sendVerificationCognito)(name);
        const response = { message: 'ok' };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        res.status(500).json(response);
    }
});
exports.sendVerification = sendVerification;
// パスワード変更
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, newPassword, verifyCode } = req.body;
        yield (0, cognitoService_1.passwordChangeCognito)(name, newPassword, verifyCode);
        const response = { message: 'ok' };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        res.status(500).json(response);
    }
});
exports.changePassword = changePassword;
