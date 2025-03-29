import { Team, CreateTeamRequest } from "../types/teamTypes";
import { BaseErrorResponse, BaseResponse } from "../types/utilityTypes";
import { Request, Response } from "express";
import { getJaDateString } from "../util/util";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

const createTeam = async (req: CreateTeamRequest, res: Response) => {
  try {
    // 日本時間の現在日時を取得
    const date = getJaDateString();
    const team: Team = {
      name: req.body.name,
      description: req.body.description,
      admin: req.body.admin,
      create_date: date,
    };

    const emblem: Buffer = req.file?.buffer || Buffer.alloc(0) // multerで処理された画像データ
    

    // チーム名の重複チェック
    const result = await checkTeamName(team.name);
    if (!result) {
      const response: BaseErrorResponse = {
        message: "Team name already exists",
      };
      res.status(400).json(response);
      return;
    }

    await addTeamData(team, emblem);

    const response: BaseResponse = { message: "ok" };
    res.status(200).json(response);
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    console.error("error", error);
    res.status(500).json(response);
  }
};

const getTeam = async (req: Request, res: Response) => {
  try {
    const userName = req.query.username as string;
    const teamData = await getTeamData(userName);
    const response = { message: "ok", data: teamData };
    res.status(200).json(response);
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    console.error("error", error);
    res.status(500).json(response);
  }
}


const addTeamData = async (team: Team, emblem: Buffer): Promise<unknown> => {
  const sqlTeam = "INSERT INTO Team (name, description, admin, create_date) VALUES (?, ?, ?, ?)";
  const sqlUserTeams = "INSERT INTO UserTeams (user_name, team_name, role) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // チーム情報をデータベースに保存
        const stmtTeam = db.prepare(sqlTeam);
        stmtTeam.run(
          [team.name, team.description, team.admin, team.create_date],
          (err: Error | null) => {
            if (err) {
              reject(err);
            }
          }
        );
        stmtTeam.finalize((err: Error | null) => {
          if (err) {
            reject(err);
          }
        });

        // UserTeamsテーブルにadminを挿入
        const stmtUserTeams = db.prepare(sqlUserTeams);
        stmtUserTeams.run(
          [team.admin, team.name, "admin"],
          (err: Error | null) => {
            if (err) {
              reject(err);
            }
          }
        );
        stmtUserTeams.finalize((err: Error | null) => {
          if (err) {
            reject(err);
          }
          resolve(null);
        });
        // S3に画像をアップロード
        const emblemKey = `teams/${team.name}/emblem.png`; // S3に保存するキー
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME as string, // S3バケット名
          Key: emblemKey,
          Body: emblem, // 画像データ
          ContentType: "image/png", // 画像のContent-Type
        };

        const command = new PutObjectCommand(uploadParams);
        const uploadResult = await s3.send(command);
        console.log("S3 Upload Success:", uploadResult);
      } catch (error) {
        console.error("S3 Upload Error:", error);
        reject(error);
      }
    });
  });
};

const getTeamData = async (userName: string): Promise<Team[]> => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Team WHERE name IN (SELECT team_name FROM UserTeams WHERE user_name = ?)";
    db.all(sql, [userName], async (err: Error | null, rows: Team[]) => {
      if (err) {
        console.error("Error fetching team data:", err);
        reject(err);
      } else {
        try {
          // S3から画像データを取得
          const teamsWithEmblem = await Promise.all(
            rows.map(async (team) => {
              const emblemKey = `teams/${team.name}/emblem.png`;
              const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: emblemKey,
              });
              const response = await s3.send(command);
              const streamToBuffer = async (stream: any): Promise<Buffer> => {
                return new Promise((resolve, reject) => {
                  const chunks: Uint8Array[] = [];
                  stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
                  stream.on("end", () => resolve(Buffer.concat(chunks)));
                  stream.on("error", reject);
                });
              };

              const emblemData = response.Body ? await streamToBuffer(response.Body) : null;

              return { ...team, emblem: emblemData };
            })
          );

          resolve(teamsWithEmblem);
        } catch (error) {
          console.error("Error fetching emblem data from S3:", error);
          reject(error);
        }
      }
    });
  });
};

// チーム名の重複チェック
const checkTeamName = async (name: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) as count FROM Team WHERE name = ?";
    db.get(sql, [name], (err: Error | null, row: { count: number }) => {
      if (err) {
        console.error("Error checking team name:", err);
        reject(err);
      } else {
        resolve(row.count === 0);
      }
    });
  });
};

export { createTeam, getTeam };
