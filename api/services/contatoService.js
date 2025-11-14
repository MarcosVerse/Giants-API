import db from "../../database/db.js";

export function listarContatos(nome, limit = 8, offset = 0) {
    return new Promise((resolve, reject) => {
        const where = nome ? " WHERE nome LIKE ?" : "";
        const paramsCount = nome ? [`%${nome}%`] : [];

        db.get(`SELECT COUNT(*) as count FROM contatos${where}`, paramsCount, (err, countRow) => {
            if (err) return reject(err);
            const total = countRow ? countRow.count : 0;

            const query = "SELECT * FROM contatos" + where + " LIMIT ? OFFSET ?";
            const params = nome ? [`%${nome}%`, limit, offset] : [limit, offset];

            db.all(query, params, async (err2, rows) => {
                if (err2) return reject(err2);

                const contatos = await Promise.all(rows.map(async (c) => {
                    let gruposIds = [];

                    try {
                        gruposIds = JSON.parse(c.grupo || "[]");
                    } catch {
                        gruposIds = [];
                    }

                    const grupos = await new Promise((resolveGroup) => {
                        if (gruposIds.length === 0) return resolveGroup([]);

                        const placeholders = gruposIds.map(() => "?").join(",");
                        db.all(`SELECT id, nome FROM grupos WHERE id IN (${placeholders})`, gruposIds, (err3, groupRows) => {
                            if (err3) return resolveGroup([]);
                            resolveGroup(groupRows);
                        });
                    });

                    return {
                        ...c,
                        grupo: grupos
                    };
                }));

                resolve({ data: contatos, total });
            });
        });
    });
}

export function criarContato({ nome, telefone, grupo }) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(grupo)) grupo = [];

        const placeholders = grupo.map(() => "?").join(",");
        db.all(
            `SELECT id FROM grupos WHERE id IN (${placeholders || "NULL"})`,
            grupo,
            (err, rows) => {
                if (err) return reject(err);

                const grupoIds = rows.map(r => r.id);
                const grupoString = JSON.stringify(grupoIds);

                db.run(
                    "INSERT INTO contatos (nome, telefone, grupo) VALUES (?, ?, ?)",
                    [nome, telefone, grupoString],
                    err2 => {
                        if (err2) return reject(err2);
                        resolve({ ok: true });
                    }
                );
            }
        );
    });
}


export function atualizarContato(id, { nome, telefone, grupo }) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(grupo)) grupo = [];

        // Pegar os IDs reais a partir dos nomes
        const placeholders = grupo.map(() => "?").join(",");
        db.all(
            `SELECT id FROM grupos WHERE nome IN (${placeholders || "NULL"})`,
            grupo,
            (err, rows) => {
                if (err) return reject(err);

                const grupoIds = rows.map(r => r.id);
                const grupoString = JSON.stringify(grupoIds);

                db.run(
                    "UPDATE contatos SET nome = ?, telefone = ?, grupo = ? WHERE id = ?",
                    [nome, telefone, grupoString, id],
                    function (err2) {
                        if (err2) return reject(err2);
                        if (this.changes === 0) return reject(new Error("Contato não encontrado."));
                        resolve({ ok: true });
                    }
                );
            }
        );
    });
}

export function deletarContato(id) {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM contatos WHERE id = ?",
            [id],
            function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error("Contato não encontrado."));
                resolve({ ok: true });
            }
        );
    });
}
