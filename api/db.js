import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"segobi123",
    database:"teste"
});