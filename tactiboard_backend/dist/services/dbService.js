"use strict";
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const db = new sqlite3.Database(process.env.DB_PATH);
// データベースから食材を取得
// exports.getIngredientsFromDB = async (sql, username) => {
//     return new Promise((resolve, reject) => {
//         db.all(sql, [username], (err, rows) => {
//         if (err) {
//             reject(err);
//         }
//         resolve({ rows });
//         });
//     });
// }
// // データベースに食材を追加
// exports.addIngredientsToDB = async (sql, ingredients, username) => {
//     return new Promise((resolve, reject) => {
//         db.serialize(() => {
//         const stmt = db.prepare(sql);
//         ingredients.forEach((ingredient) => {
//             stmt.run([
//             ingredient.name,
//             ingredient.amount,
//             ingredient.unit,
//             ingredient.deadline,
//             username,
//             ingredient.id
//             ]);
//         });
//         stmt.finalize((err) => {
//             if (err) {
//             reject(err);
//             }
//             resolve();
//         });
//         });
//     });
// }
// // データベースから食材を削除
// exports.deleteIngredientsFromDB = async (sql, ingredients, username) => {
//     return new Promise((resolve, reject) => {
//         const stmt = db.prepare(sql);
//         ingredients.forEach(ingredient => {
//             stmt.run(username, ingredient.id, (err) => {
//                 if (err) {
//                     reject(err);
//                 }
//             });
//         });
//         stmt.finalize((err) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve();
//         });
//     });
// }
// // レシピIDからレシピを取得
// exports.getRecipeByIds = async (recipe_ids) => {
//     return new Promise((resolve, reject) => {
//         const placeholders = recipe_ids.map(() => '?').join(',');
//         const sql = `SELECT * FROM recipes WHERE recipe_id IN (${placeholders})`;
//         recipe_db.all(sql, recipe_ids, (err, rows) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(rows);
//         });
//     });
// };
