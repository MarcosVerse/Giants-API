import express from "express";
import {
    getAllGrupos,
    createGrupo,
    deleteGrupo
} from "../controllers/gruposController.js";

const router = express.Router();

router.get("/", getAllGrupos);
router.post("/", createGrupo);
router.delete("/:id", deleteGrupo);

export default router;
