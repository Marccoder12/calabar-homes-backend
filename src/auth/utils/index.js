import db from "../../db/schema.js"
export const findUserByEmail = (email) => {
    console.log("Email: ", email);
    const user = db.prepare(`SELECT * from users WHERE email = ?`).get(email);
    console.log("Result: ", user);
    return user;
}