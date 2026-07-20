import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes AFTER middleware
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Flames Backend Running"
    });

});

app.use(errorHandler);

export default app;