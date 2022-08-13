import express from "express";

import expressLoader from "./express.js"

const app = express();

const startServer = async () => {
    await expressLoader(app);
    console.info("Express initialized");
    // Running the application in test mode does not start listening because parallel tests would result in EADDRINUSE
    if (process.env.NODE_ENV !== "test") {

        let server = app;
        const port = process.env.PORT || 7070;
        server.listen(port, (err) => {
            if (err) {
                console.error(err);
                return;
            }

            console.info(`Server listening on port ${port}`);
        });
    }
};

startServer();

if (process.env.NODE_ENV === "test") {
    // Necessary for test HTTP requests (End-to-End testing)
    module.exports = app;
}
