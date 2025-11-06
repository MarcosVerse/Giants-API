import express from "express";
import { enviarMensagem } from "../controllers/enviarController.js";

const router = express.Router();

router.post("/", enviarMensagem);

export default router;
