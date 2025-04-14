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
exports.deleteTactics = exports.getTactics = exports.createTactics = void 0;
const util_1 = require("../util/util");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);
const createTactics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 日本時間の現在日時を取得
        const date = (0, util_1.getJaDateString)();
        const tactics = {
            name: req.body.name,
            description: req.body.description,
            admin: req.body.admin,
            create_date: date,
            team: req.body.team,
        };
        // チーム名の重複チェック
        const result = yield checkTacticsName(tactics.name);
        if (!result) {
            const response = {
                message: "Tactics already exists",
            };
            res.status(400).json(response);
            return;
        }
        yield addTacticsData(tactics);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.createTactics = createTactics;
const addTacticsData = (tactics) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "INSERT INTO Tactics (name, description, admin, create_date, team) VALUES (?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        db.serialize(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const stmt = db.prepare(sql);
                stmt.run([tactics.name, tactics.description, tactics.admin, tactics.create_date, tactics.team], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmt.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                resolve(null);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
});
// 戦術名の重複チェック
const checkTacticsName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) as count FROM Tactics WHERE name = ?";
        db.get(sql, [name], (err, row) => {
            if (err) {
                console.error("Error checking tactics name:", err);
                reject(err);
            }
            else {
                resolve(row.count === 0);
            }
        });
    });
});
const getTactics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = req.query.username;
        const tacticsData = yield getTacticsData(userName);
        const response = { message: "ok", data: tacticsData };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.getTactics = getTactics;
const getTacticsData = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Tactics WHERE team IN (SELECT team_name FROM UserTeams WHERE user_name = ?)";
        db.all(sql, [userName], (err, rows) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error fetching team data:", err);
                reject(err);
            }
            else {
                const tacticsData = rows.map((row) => ({
                    name: row.name,
                    description: row.description,
                    admin: row.admin,
                    create_date: row.create_date,
                    team: row.team,
                }));
                resolve(tacticsData);
            }
        }));
    });
});
// 戦術を削除する
const deleteTactics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamName = req.body.team;
        const tacticsName = req.body.name;
        yield removeTacticsData(teamName, tacticsName);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.deleteTactics = deleteTactics;
const removeTacticsData = (teamName, tacticsName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Tactics WHERE team = ? AND name = ?";
        db.serialize(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // 戦術情報をデータベースから削除
                const stmtTeam = db.prepare(sql);
                stmtTeam.run([teamName, tacticsName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtTeam.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                resolve(null);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
});
