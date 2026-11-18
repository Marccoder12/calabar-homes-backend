import { loginUser, registerUser } from "./service.js";

export const register = async (req, res) => {
    try{
        const { firstname, lastname, email, password } = req.body;
        await registerUser({ firstname: firstname, lastname: lastname, email: email, password: password });
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser({email: email, password: password});

        res.status(200).cookie("session", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 3 * 24 * 60 * 60 * 1000,
                path: "/"
            }
        ).json({status: "success", message: "User Logged in successfully"})
    } catch (error) {
        console.log("Error: ", error);
    
    }
}