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
exports.getActivity = void 0;
const util_1 = require("../util/util");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);
//アクティビティを取得
const getActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 取得するアクティビティは、userNameが自身であるものと、所属するチームのもの
        // 1日以内のアクティビティを取得
        const oneWeekAgo = (0, util_1.getJaDateOneDayAgoString)();
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
        const userName = req.query.userName;
        db.all(sql, [oneWeekAgo, userName, userName], (err, rows) => {
            if (err) {
                console.error("Error fetching activities:", err);
                const response = {
                    message: err.message,
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
            const response = { message: "ok", data: activities };
            res.status(200).json(response);
        });
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.getActivity = getActivity;
