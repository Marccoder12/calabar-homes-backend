import db from "../db/schema.js";
import crypto from "node:crypto";
import { hash } from "bcrypt";
import { findUserByEmail } from "./utils/index.js";
export const registerUser = async ({firstname, lastname, email, password}) => {
    try {
        const hashedPassword = await hash(password, 10)
        // Implementation for registering user
        db.prepare(`INSERT INTO users (id, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)`).run(
            crypto.randomUUID(),
            firstname,
            lastname,
            email,
            hashedPassword
        );
    } catch (error) {
        console.error("Error: ", error);
    }
}

export const loginUser = async ({email, password}) => {

    try {
        
        //1. Find user by email
        const user = findUserByEmail(email);
        
        //2. generate a random token and session id and create a new session
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHashed = crypto.createHash("sha256").update(token).digest("hex");

        const sessionId = crypto.randomUUID();
        const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + THREE_DAYS).toISOString();
        //3. Add a new session to the table
        db.prepare(`INSERT INTO sessions (id, token, user_id, expires_at) VALUES(?, ?, ?, ?)`).run(sessionId, tokenHashed, user.id, expiresAt);
        
        //4. return the the token to the controller to be sent to the user's browser
            // 8. Return data to controller
        return {
            token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            },
            expiresAt
        };
        //5. token will be used when authenticating using the middle
        
        
    } catch (error) {
        console.error("Login user Service Error: ", error);
    }
}

// login util functions