import db from "../../database/db.js";
import client from "../services/whatsapp.js";

export const enviarMensagem = (req, res) => {
    const { grupo, mensagem } = req.body;

    db.all(
        "SELECT nome, telefone FROM contatos WHERE grupo = ?",
        [grupo],
        async (err, contatos) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!contatos.length)
                return res.status(400).json({ error: "Nenhum contato encontrado nesse grupo." });

            for (const c of contatos) {
                const textoFinal = mensagem.replace("{nome}", c.nome);
                try {
                    await client.sendMessage(`${c.telefone}@c.us`, textoFinal);
                    console.log(`Enviado para ${c.nome} (${c.telefone})`);
                    await new Promise((r) => setTimeout(r, 2000));
                } catch (e) {
                    console.log(`Erro ao enviar para ${c.nome}: ${e.message}`);
                }
            }

            res.json({ ok: true, enviados: contatos.length });
        }
    );
};
