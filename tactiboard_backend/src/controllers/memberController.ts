import { BaseErrorResponse, BaseResponse } from "../types/utilityTypes";
import { Request, Response } from "express";
import { getJaDateString } from "../util/util";

const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);

//あるチームのメンバーを取得
const getMember = async (req: Request, res: Response) => {
  try {
    const teamName = req.query.teamName as string;
    const sql = "SELECT user_name, role FROM UserTeams WHERE team_name = ?";
    db.all(
      sql,
      [teamName],
      (err: Error | null, rows: { user_name: string; role: string }[]) => {
        if (err) {
          console.error("Error fetching team members:", err);
          const response: BaseErrorResponse = {
            message: (err as Error).message,
          };
          res.status(500).json(response);
          return;
        }
        const members = rows.map((row) => ({
          name: row.user_name,
          role: row.role,
        }));
        const response: BaseResponse = { message: "ok", data: members };
        res.status(200).json(response);
      }
    );
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    console.error("error", error);
    res.status(500).json(response);
  }
};

// メンバーを招待する
const inviteMember = async (req: Request, res: Response) => {
  try {
    const { teamName, userName } = req.body;
    const date = getJaDateString();
    // Activityテーブルにアクティビティを追加
    const sqlActivity = `
     INSERT INTO Activity (name, activity, create_date, team, user)
     VALUES (?, ?, ?, ?, ?)
   `;

    // トランザクションを開始
    db.serialize(() => {
      const activityName = `invited to ${teamName}`;
      const activity = "invite";
      const createDate = date;

      db.run(
        sqlActivity,
        [activityName, activity, createDate, teamName, userName],
        function (err: Error | null) {
          if (err) {
            console.error("Error logging activity:", err);
            const response: BaseErrorResponse = {
              message: (err as Error).message,
            };
            res.status(500).json(response);
            return;
          }

          // 成功レスポンスを返す
          const response: BaseResponse = { message: "ok" };
          res.status(200).json(response);
        }
      );
    });
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    console.error("error", error);
    res.status(500).json(response);
  }
};

export { getMember, inviteMember };
