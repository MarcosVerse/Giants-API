import db from "../../database/db.js";

async function buscarGruposDoContato(gruposIds) {
    return new Promise((resolve) => {
        if (!gruposIds || gruposIds.length === 0) return resolve([]);

        const placeholders = gruposIds.map(() => "?").join(",");
        db.all(
            `SELECT id, nome FROM grupos WHERE id IN (${placeholders})`,
            gruposIds,
            (err, groupRows) => {
                if (err) return resolve([]);
                resolve(groupRows || []);
            }
        );
    });
}

async function processarContatos(rows) {
    return Promise.all(rows.map(async (c) => {
        let gruposIds = [];
        try {
            gruposIds = JSON.parse(c.grupo || "[]");
        } catch {
            gruposIds = [];
        }

        const grupos = await buscarGruposDoContato(gruposIds);

        return {
            id: c.id,
            nome: c.nome,
            telefone: c.telefone,
            grupo: grupos
        };
    }));
}

export function buscarContatosAvancado({ nome, telefone, grupos, limit = 8, offset = 0 }) {
    return new Promise((resolve, reject) => {
        let conditions = [];
        let params = [];

        if (nome && nome.trim()) {
            conditions.push("nome LIKE ?");
            params.push(`%${nome}%`);
        }

        if (telefone && telefone.trim()) {
            conditions.push("telefone LIKE ?");
            params.push(`%${telefone}%`);
        }

        const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
        const countParams = [...params];

        db.get(
            `SELECT COUNT(*) as count FROM contatos${whereClause}`,
            countParams,
            (err, countRow) => {
                if (err) return reject(err);

                const query = `SELECT * FROM contatos${whereClause} LIMIT ? OFFSET ?`;
                params.push(limit, offset);

                db.all(query, params, async (err2, rows) => {
                    if (err2) return reject(err2);

                    let contatos = await processarContatos(rows);

                    if (grupos && Array.isArray(grupos) && grupos.length > 0) {
                        contatos = contatos.filter(c =>
                            c.grupo.some(g => grupos.includes(g.id))
                        );
                    }

                    const total = (grupos && grupos.length > 0) ? contatos.length : (countRow?.count || 0);

                    resolve({ data: contatos, total });
                });
            }
        );
    });
}

export function criarContato({ nome, telefone, grupo }) {
    return new Promise((resolve, reject) => {
        if (!nome || !telefone) {
            return reject(new Error("Nome e telefone são obrigatórios"));
        }

        if (!Array.isArray(grupo)) grupo = [];

        if (grupo.length === 0) {
            const grupoString = JSON.stringify([]);
            db.run(
                "INSERT INTO contatos (nome, telefone, grupo) VALUES (?, ?, ?)",
                [nome, telefone, grupoString],
                function (err) {
                    if (err) return reject(err);
                    resolve({ ok: true, id: this.lastID });
                }
            );
            return;
        }

        const placeholders = grupo.map(() => "?").join(",");
        db.all(
            `SELECT id FROM grupos WHERE id IN (${placeholders})`,
            grupo,
            (err, rows) => {
                if (err) return reject(err);

                const grupoIds = rows.map(r => r.id);
                const grupoString = JSON.stringify(grupoIds);

                db.run(
                    "INSERT INTO contatos (nome, telefone, grupo) VALUES (?, ?, ?)",
                    [nome, telefone, grupoString],
                    function (err2) {
                        if (err2) return reject(err2);
                        resolve({ ok: true, id: this.lastID });
                    }
                );
            }
        );
    });
}

export function atualizarContato(id, { nome, telefone, grupo }) {
    return new Promise((resolve, reject) => {
        if (!nome || !telefone) {
            return reject(new Error("Nome e telefone são obrigatórios"));
        }

        if (!Array.isArray(grupo)) grupo = [];

        if (grupo.length === 0) {
            const grupoString = JSON.stringify([]);
            db.run(
                "UPDATE contatos SET nome = ?, telefone = ?, grupo = ? WHERE id = ?",
                [nome, telefone, grupoString, id],
                function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error("Contato não encontrado"));
                    resolve({ ok: true });
                }
            );
            return;
        }

        const placeholders = grupo.map(() => "?").join(",");
        db.all(
            `SELECT id FROM grupos WHERE id IN (${placeholders})`,
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
                        if (this.changes === 0) return reject(new Error("Contato não encontrado"));
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
                if (this.changes === 0) return reject(new Error("Contato não encontrado"));
                resolve({ ok: true });
            }
        );
    });
}