import express from "express";
import {
    searchContatos,
    createContato,
    updateContato,
    deleteContato
} from "../controllers/contatosController.js";

const router = express.Router();

router.post("/search", searchContatos);
router.post("/", createContato);
router.put("/:id", updateContato);
router.delete("/:id", deleteContato);

export default router;  