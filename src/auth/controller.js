import { registerUser } from "./service.js";

export const register = async (req, res, next) => {
    try{
        const { firstname, lastname, email, password } = req.body;
        await registerUser({ firstname, lastname, email, password }, res, next);
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
        next();
    } catch (error) {
        next(error);
    }
}