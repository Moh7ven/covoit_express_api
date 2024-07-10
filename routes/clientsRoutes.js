import express from "express";
import { createClient, loginClient } from "../controllers/clientsController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/add-client", upload.any(), createClient);

router.post("/login-client", upload.any(), loginClient);

export default router;
