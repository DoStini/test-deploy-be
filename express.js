import express from "express";
import session from "express-session";

export default (app) => {
    // Checking for session secret
    // Setting session middleware
    app.use(session({
        path: "/",
        httpOnly: true,
        maxAge: null,
        secret: "ola",
        resave: true,
        saveUninitialized: true,

        // Necessary due to reverse proxy setup, but it won't affect anything if there is no proxy.
        // Check https://github.com/expressjs/session/issues/281 for more details
        proxy: true,

        cookie: {
            secure: process.env.NODE_ENV !== "test",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "none"
        },
    }));

    // JSON bodyparser (parses JSON request body into req.body)
    app.use(express.json());


    // Adding headers (CORS)
    app.use((_, res, next) => {
        // Allow connections for all origins
        res.setHeader("Access-Control-Allow-Origin", "*");
        // Allowed request methods
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        // Allowed request headers
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, authorization");
        // Because we need the website to include cookies in the requests sent
        // to the API (we are using sessions)
        res.setHeader("Access-Control-Allow-Credentials", true);
        // Continue to next layer of middleware
        return next();
    });

    const isHeroku = process.env.HEROKU;

    // Health check endpoint
    app.get("/", (_, res) => res.status(200).json({ "ISHEROKY": isHeroku == true }));

    // enhance endpoint requests with common parameters like having admin privileges
    // Registering the application's routes
    // Using no prefix as the app will be mapped to /api anyway in the production server

    // - Error handling
    // Adds default error catcher as last resort
};
