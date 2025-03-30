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
exports.inviteMember = exports.getMember = void 0;
const util_1 = require("../util/util");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);
//あるチームのメンバーを取得
const getMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamName = req.query.teamName;
        const sql = "SELECT user_name, role FROM UserTeams WHERE team_name = ?";
        db.all(sql, [teamName], (err, rows) => {
            if (err) {
                console.error("Error fetching team members:", err);
                const response = {
                    message: err.message,
                };
                res.status(500).json(response);
                return;
            }
            const members = rows.map((row) => ({
                name: row.user_name,
                role: row.role,
            }));
            const response = { message: "ok", data: members };
            res.status(200).json(response);
        });
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.getMember = getMember;
// メンバーを招待する
const inviteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamName, userName } = req.body;
        const date = (0, util_1.getJaDateString)();
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
            db.run(sqlActivity, [activityName, activity, createDate, teamName, userName], function (err) {
                if (err) {
                    console.error("Error logging activity:", err);
                    const response = {
                        message: err.message,
                    };
                    res.status(500).json(response);
                    return;
                }
                // 成功レスポンスを返す
                const response = { message: "ok" };
                res.status(200).json(response);
            });
        });
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.inviteMember = inviteMember;
