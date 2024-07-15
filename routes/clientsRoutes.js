import express from "express";
import {
  createClient,
  loginClient,
  getUserConnected,
  updateClient,
  addTrajet,
  saveAsConducteur,
} from "../controllers/clientsController.js";
import multer from "multer";
import authClient from "../middlewares/authClient.js";

const router = express.Router();
const upload = multer();

router.post("/add-client", upload.any(), createClient);

router.post("/login-client", upload.any(), loginClient);

router.get("/get-client-connected", upload.any(), authClient, getUserConnected);

router.put("/update-client", upload.any(), authClient, updateClient);

router.post("/add-trajet/", upload.any(), authClient, addTrajet);

router.post("/save-as-conducteur", upload.any(), authClient, saveAsConducteur);
export default router;
