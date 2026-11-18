import db from "../db/schema.js";
export const registerUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        // Implementation for registering user
        db.prepare(`INSERT INTO users (id, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)`).run(
            crypto.randomUUID(),
            firstname,
            lastname,
            email,
            password
        );

        res.status(201).json({ message: "User registered successfully" });

        next();

    } catch (error) {
        next(error);
    }
}