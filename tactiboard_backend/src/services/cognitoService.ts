import { CognitoIdentityProviderClient, SignUpCommand, AdminConfirmSignUpCommand, InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand, AdminUpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { User } from '../types/userTypes';

const getSecretHash = (username: string): string => {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(username + clientId);
  return hmac.digest("base64");
};

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

// ユーザーのサインアップ
export const signUpCognito = async (user: User): Promise<string> => {
  try {
    const { name, password, email } = user;
    const secretHash = getSecretHash(name);

    // ユーザーのサインアップ
    const signUpCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: name,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email }
      ],
      SecretHash: secretHash
    });

    await cognitoClient.send(signUpCommand);

    // 管理者によるサインアップの確認
    const adminConfirmCommand = new AdminConfirmSignUpCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: name
    });

    await cognitoClient.send(adminConfirmCommand);

    // メールアドレスを確認済みに設定
    const updateAttributesCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: name,
      UserAttributes: [
        { Name: "email_verified", Value: "true" }
      ]
    });

    await cognitoClient.send(updateAttributesCommand);

    return "ok";
  } catch (error) {
    console.error("Error signing up user:", (error as Error).message);
    throw error;
  }
};

// ユーザーのサインイン
export const signInCognito = async (name: string, password: string): Promise<string> => {
  try {
    // ユーザーのサインイン
    const signInCommand = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: name,
        PASSWORD: password,
        SECRET_HASH: getSecretHash(name)
      }
    });

    const signInResponse = await cognitoClient.send(signInCommand);

    // アクセストークンを取得
    const accessToken = signInResponse.AuthenticationResult!.AccessToken!;

    return  accessToken ;
  } catch (error) {
    console.error("Error signing in user:", error);
    throw error;
  }
};

// パスワードのリセット
export const sendVerificationCognito = async (name: string): Promise<void> => {
  try {
    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: name,
      SecretHash: getSecretHash(name)
    });

    await cognitoClient.send(command);
  } catch (error) {
    console.error("Error send verification:", error);
    throw error;
  }
};

// パスワードの変更
export const passwordChangeCognito = async (name: string, newPassword: string, verifyCode: string): Promise<void> => {
  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: name,
      Password: newPassword,
      SecretHash: getSecretHash(name),
      ConfirmationCode: verifyCode
    });

    await cognitoClient.send(command);
  } catch (error) {
    console.error("Error send verification:", error);
    throw error;
  }
};