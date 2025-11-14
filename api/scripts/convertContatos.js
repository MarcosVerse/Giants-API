import db from "../../database/db.js";

db.all("SELECT id, grupo FROM contatos", async (err, rows) => {
    if (err) {
        console.error("Erro ao buscar contatos:", err);
        return;
    }

    for (const c of rows) {
        if (!c.grupo) continue;

        let gruposParsed;
        try {
            gruposParsed = JSON.parse(c.grupo);
        } catch {
            gruposParsed = [];
        }

        if (typeof gruposParsed[0] === "number") continue;

        const novosIds = [];

        for (const nome of gruposParsed) {
            await new Promise((resolve) => {
                db.get("SELECT id FROM grupos WHERE nome = ?", [nome], (err2, row) => {
                    if (!err2 && row) novosIds.push(row.id);
                    resolve();
                });
            });
        }

        if (novosIds.length > 0) {
            db.run(
                "UPDATE contatos SET grupo = ? WHERE id = ?",
                [JSON.stringify(novosIds), c.id],
                (err3) => {
                    if (err3) console.error("Erro ao atualizar contato", c.id, err3);
                    else console.log(`Contato ${c.id} atualizado ->`, novosIds);
                }
            );
        }
    }

    console.log("Conversão concluída.");
});
