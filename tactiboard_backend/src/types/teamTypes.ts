import { Request } from 'express';
import { BaseResponse } from './utilityTypes';

export interface Team {
    name: string;
    description: string;
    admin: string;
    create_date: string;
}

export interface CreateTeamRequest  {
  body: {
    name: string;
    description: string;
    admin: string;
  };
  file?: {
    buffer: Buffer; // multerで処理された画像データ
    mimetype: string; // ファイルのMIMEタイプ (例: image/png)
    originalname: string; // 元のファイル名
  };
}