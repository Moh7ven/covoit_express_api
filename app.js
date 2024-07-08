import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";
import connectDB from "./config/db.js";
import clientRoutes from "./routes/clientsRoutes.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use("/api/v1/clients/", clientRoutes);
export default app;
