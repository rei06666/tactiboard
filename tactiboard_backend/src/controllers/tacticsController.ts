import { Tactics } from "../types/tacticsTypes";
import { BaseErrorResponse, BaseResponse } from "../types/utilityTypes";
import { Request, Response } from "express";
import { getJaDateString } from "../util/util";

const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const db = new sqlite3.Database(process.env.DB_PATH);


const createTactics = async (req: Request, res: Response) => {
    try {
        // 日本時間の現在日時を取得
        const date = getJaDateString();
        const tactics: Tactics = {
            name: req.body.name,
            description: req.body.description,
            admin: req.body.admin,
            create_date: date,
            team: req.body.team,
        };

        // チーム名の重複チェック
        const result = await checkTacticsName(tactics.name);
        if (!result) {
            const response: BaseErrorResponse = {
                message: "Tactics already exists",
            };
            res.status(400).json(response);
            return;
        }

        await addTacticsData(tactics);

        const response: BaseResponse = { message: "ok" };
        res.status(200).json(response);
    } catch (error) {
        const response: BaseErrorResponse = { message: (error as Error).message };
        console.error("error", error);
        res.status(500).json(response);
    }
};

const addTacticsData = async (tactics: Tactics): Promise<unknown> => {
    const sql = "INSERT INTO Tactics (name, description, admin, create_date, team) VALUES (?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        db.serialize(async () => {
            try {
                const stmt = db.prepare(sql);
                stmt.run(
                    [tactics.name, tactics.description, tactics.admin, tactics.create_date, tactics.team],
                    (err: Error | null) => {
                        if (err) {
                            reject(err);
                        }
                    }
                );
                stmt.finalize((err: Error | null) => {
                    if (err) {
                        reject(err);
                    }
                });
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    });
};

// 戦術名の重複チェック
const checkTacticsName = async (name: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) as count FROM Tactics WHERE name = ?";
        db.get(sql, [name], (err: Error | null, row: { count: number }) => {
            if (err) {
                console.error("Error checking tactics name:", err);
                reject(err);
            } else {
                resolve(row.count === 0);
            }
        });
    });
};


const getTactics = async (req: Request, res: Response) => {
    try {
        const userName = req.query.username as string;
        const tacticsData = await getTacticsData(userName);
        const response = { message: "ok", data: tacticsData };
        res.status(200).json(response);
    } catch (error) {
        const response: BaseErrorResponse = { message: (error as Error).message };
        console.error("error", error);
        res.status(500).json(response);
    }
}

const getTacticsData = async (userName: string): Promise<Tactics[]> => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Tactics WHERE team IN (SELECT team_name FROM UserTeams WHERE user_name = ?)";
        db.all(sql, [userName], async (err: Error | null, rows: Tactics[]) => {
            if (err) {
                console.error("Error fetching team data:", err);
                reject(err);
            } else {
                const tacticsData = rows.map((row) => ({
                    name: row.name,
                    description: row.description,
                    admin: row.admin,
                    create_date: row.create_date,
                    team: row.team,
                }));
                resolve(tacticsData);
            }
        }
        );
    });
};


// 戦術を削除する
const deleteTactics = async (req: Request, res: Response) => {
    try {
        const teamName = req.body.team;
        const tacticsName = req.body.name;
        await removeTacticsData(teamName, tacticsName);
        const response: BaseResponse = { message: "ok" };
        res.status(200).json(response);
    } catch (error) {
        const response: BaseErrorResponse = { message: (error as Error).message };
        console.error("error", error);
        res.status(500).json(response);
    }
};

const removeTacticsData = async (teamName: string, tacticsName: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Tactics WHERE team = ? AND name = ?";
        db.serialize(async () => {
            try {
                // 戦術情報をデータベースから削除
                const stmtTeam = db.prepare(sql);
                stmtTeam.run([teamName, tacticsName], (err: Error | null) => {
                    if (err) {
                        reject(err);
                    }
                });
                stmtTeam.finalize((err: Error | null) => {
                    if (err) {
                        reject(err);
                    }
                });
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    });
};

export { createTactics, getTactics, deleteTactics };
