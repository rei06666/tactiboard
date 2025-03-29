import { signUpCognito, signInCognito, passwordChangeCognito, sendVerificationCognito } from '../services/cognitoService';
import { User, SignUpRequest, SignInRequest, SignInResponse, PasswordChangeRequest,} from '../types/userTypes';
import { BaseErrorResponse, BaseResponse } from '../types/utilityTypes';
import { Request, Response } from 'express';
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);

// ユーザー登録
const signUp = async (req: SignUpRequest, res: Response) => {
  try {
    const user: User = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
    };

    await signUpCognito(user);
    await addUserData(user.name);

    const response: BaseResponse = { message: 'ok' };
    res.status(200).json(response);
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    res.status(500).json(response);
  }
};

const addUserData = async (name: string) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO User (name) VALUES (?)";
    db.run(sql, [name], (err: Error | null) => {
      if (err) {
        console.error("Error inserting data:", err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

// ログイン
const signIn = async (req: SignInRequest, res: Response) => {
  try {
    const { name, password } = req.body;
    const accessToken: string = await signInCognito(name, password);
    const response: SignInResponse = { message: 'ok', accessToken };
    res.status(200).json(response);
    
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    res.status(500).json(response);
  }
};

// メールアドレス確認コード送信
const sendVerification = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    await sendVerificationCognito(name);
    const response: BaseResponse = { message: 'ok' };
    res.status(200).json(response);
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    res.status(500).json(response);
  }
};
  

// パスワード変更
const changePassword = async (req: PasswordChangeRequest, res: Response) => {
  try {
    const { name, newPassword, verifyCode } = req.body;
    await passwordChangeCognito(name, newPassword, verifyCode);
    const response: BaseResponse = { message: 'ok' };
    res.status(200).json(response);
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    res.status(500).json(response);
  }
};

export { signUp, signIn, changePassword, sendVerification };