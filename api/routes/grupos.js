import express from "express";
import {
    getAllGrupos,
    createGrupo,
    deleteGrupo,
    updateGrupo
} from "../controllers/gruposController.js";

const router = express.Router();

router.get("/", getAllGrupos);
router.post("/", createGrupo);
router.put("/:id", updateGrupo);
router.delete("/:id", deleteGrupo);

export default router;
