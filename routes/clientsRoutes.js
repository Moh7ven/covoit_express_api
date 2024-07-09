import express from "express";
import { createClient } from "../controllers/clientsController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/add-client", upload.any(), createClient);

export default router;
