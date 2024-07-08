import express from "express";
import { getAllClients } from "../controllers/clientsController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/", upload.any(), getAllClients);

export default router;
