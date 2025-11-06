import db from "../../database/db.js";

// GET /api/grupos
export const getAllGrupos = (req, res) => {
    db.all("SELECT * FROM grupos", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// POST /api/grupos
export const createGrupo = (req, res) => {
    const { nome } = req.body;
    db.run("INSERT INTO grupos (nome) VALUES (?)", [nome], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ok: true });
    });
};

// DELETE /api/grupos/:id
export const deleteGrupo = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM grupos WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ok: true });
    });
};
