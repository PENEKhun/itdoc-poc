import "express-async-errors";
import errorResponseHandler from "./src/middleware/error-response-handler.js";
import authRoutes from "./src/routes/auth-routes.js";
import "./src/db/knex-config.js";
import successResponseHandler from "./src/middleware/success-response-handler.js";
import notFoundHandler from "./src/middleware/not-found-handler.js";
import express from "express";

const app = express();

app.use(successResponseHandler);

app.use("/api/v1/", authRoutes);
app.use(notFoundHandler);
app.use(errorResponseHandler);

export default app;
