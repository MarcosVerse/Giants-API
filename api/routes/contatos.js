import express from "express";
import {
    getAllContatos,
    createContato,
    updateContato,
    deleteContato
} from "../controllers/contatosController.js";

const router = express.Router();

router.get("/", getAllContatos);
router.post("/", createContato);
router.put("/:id", updateContato);
router.delete("/:id", deleteContato);

export default router;
