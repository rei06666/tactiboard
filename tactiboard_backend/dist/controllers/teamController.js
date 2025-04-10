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
exports.RejectTeam = exports.JoinTeam = exports.leaveTeam = exports.deleteTeam = exports.getTeam = exports.createTeam = void 0;
const util_1 = require("../util/util");
const client_s3_1 = require("@aws-sdk/client-s3");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
});
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 日本時間の現在日時を取得
        const date = (0, util_1.getJaDateString)();
        const team = {
            name: req.body.name,
            description: req.body.description,
            admin: req.body.admin,
            create_date: date,
        };
        const emblem = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) || Buffer.alloc(0); // multerで処理された画像データ
        // チーム名の重複チェック
        const result = yield checkTeamName(team.name);
        if (!result) {
            const response = {
                message: "Team name already exists",
            };
            res.status(400).json(response);
            return;
        }
        yield addTeamData(team, emblem);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.createTeam = createTeam;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = req.query.username;
        const teamData = yield getTeamData(userName);
        const response = { message: "ok", data: teamData };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.getTeam = getTeam;
const addTeamData = (team, emblem) => __awaiter(void 0, void 0, void 0, function* () {
    const sqlTeam = "INSERT INTO Team (name, description, admin, create_date) VALUES (?, ?, ?, ?)";
    const sqlUserTeams = "INSERT INTO UserTeams (user_name, team_name, role) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
        db.serialize(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // チーム情報をデータベースに保存
                const stmtTeam = db.prepare(sqlTeam);
                stmtTeam.run([team.name, team.description, team.admin, team.create_date], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtTeam.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                // UserTeamsテーブルにadminを挿入
                const stmtUserTeams = db.prepare(sqlUserTeams);
                stmtUserTeams.run([team.admin, team.name, "admin"], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtUserTeams.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
                // S3に画像をアップロード
                const emblemKey = `teams/${team.name}/emblem.png`; // S3に保存するキー
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME, // S3バケット名
                    Key: emblemKey,
                    Body: emblem, // 画像データ
                    ContentType: "image/png", // 画像のContent-Type
                };
                const command = new client_s3_1.PutObjectCommand(uploadParams);
                const uploadResult = yield s3.send(command);
                console.log("S3 Upload Success:", uploadResult);
            }
            catch (error) {
                console.error("S3 Upload Error:", error);
                reject(error);
            }
        }));
    });
});
const getTeamData = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Team WHERE name IN (SELECT team_name FROM UserTeams WHERE user_name = ?)";
        db.all(sql, [userName], (err, rows) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error fetching team data:", err);
                reject(err);
            }
            else {
                try {
                    // S3から画像データを取得
                    const teamsWithEmblem = yield Promise.all(rows.map((team) => __awaiter(void 0, void 0, void 0, function* () {
                        const emblemKey = `teams/${team.name}/emblem.png`;
                        const command = new client_s3_1.GetObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: emblemKey,
                        });
                        const response = yield s3.send(command);
                        const streamToBuffer = (stream) => __awaiter(void 0, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => {
                                const chunks = [];
                                stream.on("data", (chunk) => chunks.push(chunk));
                                stream.on("end", () => resolve(Buffer.concat(chunks)));
                                stream.on("error", reject);
                            });
                        });
                        const emblemData = response.Body ? yield streamToBuffer(response.Body) : null;
                        return Object.assign(Object.assign({}, team), { emblem: emblemData });
                    })));
                    resolve(teamsWithEmblem);
                }
                catch (error) {
                    console.error("Error fetching emblem data from S3:", error);
                    reject(error);
                }
            }
        }));
    });
});
// チーム名の重複チェック
const checkTeamName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) as count FROM Team WHERE name = ?";
        db.get(sql, [name], (err, row) => {
            if (err) {
                console.error("Error checking team name:", err);
                reject(err);
            }
            else {
                resolve(row.count === 0);
            }
        });
    });
});
// チームを削除する
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamName = req.body.name;
        // チームを削除する処理
        yield removeTeamData(teamName);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.deleteTeam = deleteTeam;
const removeTeamData = (teamName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const sqlTeam = "DELETE FROM Team WHERE name = ?";
        const sqlUserTeams = "DELETE FROM UserTeams WHERE team_name = ?";
        const sqlTactics = "DELETE FROM Tactics WHERE team = ?";
        db.serialize(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // チーム情報をデータベースから削除
                const stmtTeam = db.prepare(sqlTeam);
                stmtTeam.run([teamName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtTeam.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                // UserTeamsテーブルからadminを削除
                const stmtUserTeams = db.prepare(sqlUserTeams);
                stmtUserTeams.run([teamName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtUserTeams.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
                // Tacticsテーブルからチームを削除
                const stmtTactics = db.prepare(sqlTactics);
                stmtTactics.run([teamName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtTactics.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                // S3から画像を削除
                const emblemKey = `teams/${teamName}/emblem.png`; // S3に保存するキー
                const deleteParams = {
                    Bucket: process.env.S3_BUCKET_NAME, // S3バケット名
                    Key: emblemKey,
                };
                const command = new client_s3_1.DeleteObjectCommand(deleteParams);
                const deleteResult = yield s3.send(command);
                console.log("S3 Delete Success:", deleteResult);
            }
            catch (error) {
                console.error("S3 Delete Error:", error);
                reject(error);
            }
        }));
    });
});
// チームを脱退する
const leaveTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamName = req.body.name;
        const userName = req.body.username;
        // チームを脱退する処理
        yield removeUserFromTeam(userName, teamName);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.leaveTeam = leaveTeam;
const removeUserFromTeam = (userName, teamName) => __awaiter(void 0, void 0, void 0, function* () {
    // Acitivityテーブルに脱退Activityを追加し、UserTeamsテーブルからユーザーを削除
    return new Promise((resolve, reject) => {
        const sqlUserTeams = "DELETE FROM UserTeams WHERE user_name = ? AND team_name = ?";
        const sqlActivity = "INSERT INTO Activity (name, activity, create_date, team, user) VALUES (?, ?, ?, ?, ?)";
        db.serialize(() => {
            try {
                // UserTeamsテーブルからユーザーを削除
                const stmtUserTeams = db.prepare(sqlUserTeams);
                stmtUserTeams.run([userName, teamName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtUserTeams.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                // Activityテーブルに脱退Activityを追加
                const date = (0, util_1.getJaDateString)();
                const activityName = `${userName} has left the team ${teamName}`;
                const activity = "leave";
                const stmtActivity = db.prepare(sqlActivity);
                stmtActivity.run([activityName, activity, date, teamName, userName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtActivity.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
            }
            catch (error) {
                console.error("S3 Delete Error:", error);
                reject(error);
            }
        });
    });
});
// チームに参加する
const JoinTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamName = req.body.teamName;
        const userName = req.body.userName;
        const activityName = req.body.activityName;
        // チームに参加する処理
        yield addUserToTeam(userName, teamName, activityName);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.JoinTeam = JoinTeam;
const addUserToTeam = (userName, teamName, activityName) => __awaiter(void 0, void 0, void 0, function* () {
    // Acitivityテーブルに参加Activityを追加し招待Activityを削除、UserTeamsテーブルにユーザーを追加
    return new Promise((resolve, reject) => {
        const sqlUserTeams = "INSERT INTO UserTeams (user_name, team_name, role) VALUES (?, ?, ?)";
        const sqlActivity = "INSERT INTO Activity (name, activity, create_date, team, user) VALUES (?, ?, ?, ?, ?)";
        db.serialize(() => {
            try {
                // UserTeamsテーブルにユーザーを追加
                const stmtUserTeams = db.prepare(sqlUserTeams);
                stmtUserTeams.run([userName, teamName, "member"], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtUserTeams.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
                // Activityテーブルに参加Activityを追加
                const date = (0, util_1.getJaDateString)();
                const joinactivityName = `${userName} has joined the team ${teamName}`;
                const activity = "join";
                const stmtActivity = db.prepare(sqlActivity);
                stmtActivity.run([joinactivityName, activity, date, teamName, userName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtActivity.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
                // 招待Activityを削除
                const sqlDeleteActivity = "DELETE FROM Activity WHERE name = ?";
                const stmtDeleteActivity = db.prepare(sqlDeleteActivity);
                stmtDeleteActivity.run([activityName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtDeleteActivity.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
            }
            catch (error) {
                console.error("S3 Delete Error:", error);
                reject(error);
            }
        });
    });
});
// 招待を拒否する
const RejectTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityName = req.body.activityName;
        // 招待を拒否する処理
        yield removeInviteActivity(activityName);
        const response = { message: "ok" };
        res.status(200).json(response);
    }
    catch (error) {
        const response = { message: error.message };
        console.error("error", error);
        res.status(500).json(response);
    }
});
exports.RejectTeam = RejectTeam;
const removeInviteActivity = (activityName) => __awaiter(void 0, void 0, void 0, function* () {
    // Acitivityテーブルから招待Activityを削除
    return new Promise((resolve, reject) => {
        const sqlActivity = "DELETE FROM Activity WHERE name = ?";
        db.serialize(() => {
            try {
                // Activityテーブルから招待Activityを削除
                const stmtActivity = db.prepare(sqlActivity);
                stmtActivity.run([activityName], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtActivity.finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
            }
            catch (error) {
                console.error("S3 Delete Error:", error);
                reject(error);
            }
        });
    });
});
