import db from "../../database/db.js";

export const getAllGrupos = (req, res) => {
    db.all("SELECT * FROM grupos", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const createGrupo = (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    db.run("INSERT INTO grupos (nome) VALUES (?)", [nome], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome });
    });
};

export const updateGrupo = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    db.run("UPDATE grupos SET nome = ? WHERE id = ?", [nome, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Grupo não encontrado" });
        res.json({ id, nome });
    });
};

export const deleteGrupo = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM grupos WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Grupo não encontrado" });
        res.json({ ok: true, deletedId: id });
    });
};
