import db from "../../database/db.js";

// GET /api/contatos
export const getAllContatos = (req, res) => {
    db.all("SELECT * FROM contatos", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const contatos = rows.map(c => ({
            ...c,
            grupo: JSON.parse(c.grupo || "[]")
        }));
        res.json(contatos);
    });
};

// POST /api/contatos
export const createContato = (req, res) => {
    const { nome, telefone, grupo } = req.body;
    const gruposArray = Array.isArray(grupo) ? grupo : (grupo ? [grupo] : []);
    db.run(
        "INSERT INTO contatos (nome, telefone, grupo) VALUES (?, ?, ?)",
        [nome, telefone, JSON.stringify(gruposArray)],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        }
    );
};

// PUT /api/contatos/:id
export const updateContato = (req, res) => {
    const { id } = req.params;
    const { nome, telefone, grupo } = req.body;

    let grupoString = [];
    if (Array.isArray(grupo)) grupoString = JSON.stringify(grupo);
    else if (grupo) grupoString = JSON.stringify([grupo]);
    else grupoString = JSON.stringify([]);

    db.run(
        "UPDATE contatos SET nome = ?, telefone = ?, grupo = ? WHERE id = ?",
        [nome, telefone, grupoString, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0)
                return res.status(404).json({ error: "Contato não encontrado." });
            res.json({ ok: true });
        }
    );
};

// DELETE /api/contatos/:id
export const deleteContato = (req, res) => {
    const { id } = req.params;
    db.run(
        "DELETE FROM contatos WHERE id = ?",
        [id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0)
                return res.status(404).json({ error: "Contato não encontrado." });
            res.json({ ok: true });
        }
    );
};
