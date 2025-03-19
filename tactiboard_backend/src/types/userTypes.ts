import { Request } from 'express';
import { BaseResponse } from './utilityTypes';

// ユーザー情報
export interface User {
    name: string;
    password: string;
    email: string;
}

// サインアップリクエスト
export interface SignUpRequest extends Request {
  body: {
    email: string;
    name: string;
    password: string;
  };
}

// サインインリクエスト
export interface SignInRequest extends Request {
  body: {
    name: string;
    password: string;
  };
}

// サインインレスポンス
export interface SignInResponse extends BaseResponse {
  accessToken: string;
}

// パスワード変更リクエスト
export interface PasswordChangeRequest extends Request {
  body: {
    name: string;
    newPassword: string;
    verifyCode: string;
  };
}