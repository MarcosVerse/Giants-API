import db from "../database/db.js";

export const listarGrupos = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM grupos", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const criarGrupo = (nome) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO grupos (nome) VALUES (?)", [nome], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, nome });
        });
    });
};

export const atualizarGrupo = (id, nome) => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE grupos SET nome = ? WHERE id = ?", [nome, id], function (err) {
            if (err) reject(err);
            else resolve({ id, nome });
        });
    });
};

export const deletarGrupo = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM grupos WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            else resolve({ success: true });
        });
    });
};
