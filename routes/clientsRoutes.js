import express from "express";
import {
  createClient,
  getAllClients,
} from "../controllers/clientsController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/get-all-clients", upload.any(), getAllClients);
router.post("/add-client", upload.any(), createClient);

export default router;
