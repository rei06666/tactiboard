import { BaseErrorResponse, BaseResponse } from "../types/utilityTypes";
import { Request, Response } from "express";
import { getJaDateString, getJaDateOneDayAgoString } from "../util/util";
import { teamRoutes } from "../routes/teamRoutes";

const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);

//アクティビティを取得
const getActivity = async (req: Request, res: Response) => {
  try {
    // 取得するアクティビティは、userNameが自身であるものと、所属するチームのもの
    // 1日以内のアクティビティを取得
    const oneWeekAgo = getJaDateOneDayAgoString();
    const sql = `
      SELECT name, activity, create_date, team, user
      FROM Activity
      WHERE create_date >= ?
      AND (user = ? OR team IN (
        SELECT team_name
        FROM UserTeams
        WHERE user_name = ?
      ))
      ORDER BY create_date DESC
    `;
    const userName = req.query.userName as string;
    db.all(
      sql,
      [oneWeekAgo, userName, userName],
      (err: Error | null, rows: { name: string; activity: string; create_date: string; team: string; user: string }[]) => {
        if (err) {
          console.error("Error fetching activities:", err);
          const response: BaseErrorResponse = {
            message: (err as Error).message,
          };
          res.status(500).json(response);
          return;
        }
        const activities = rows.map((row) => ({
          name: row.name,
          activity: row.activity,
          create_date: row.create_date,
          team: row.team,
          user: row.user,
        }));
        const response: BaseResponse = { message: "ok", data: activities };
        res.status(200).json(response);
      }
    );
  } catch (error) {
    const response: BaseErrorResponse = { message: (error as Error).message };
    console.error("error", error);
    res.status(500).json(response);
  }
};

export { getActivity };
