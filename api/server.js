import express from "express";
import cors from "cors";
import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import db from "../database/db.js";

const app = express();
app.use(express.json());
app.use(cors());

const { Client, LocalAuth } = pkg;

// cliente do whats
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
    console.log("📱 Escaneia esse QR no celular pra conectar:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ WhatsApp conectado e pronto pra uso!");
});

client.initialize();

// rota de cadastro de contato
app.post("/api/contatos", (req, res) => {
    const { nome, telefone, grupo } = req.body;
    db.run(
        "INSERT INTO contatos (nome, telefone, grupo) VALUES (?, ?, ?)",
        [nome, telefone, grupo],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        }
    );
});

// rota de listar contatos
app.get("/api/contatos", (req, res) => {
    db.all("SELECT * FROM contatos", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// rota de enviar mensagens
app.post("/api/enviar", async (req, res) => {
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
                    console.log(`✅ Enviado para ${c.nome} (${c.telefone})`);
                    await new Promise((r) => setTimeout(r, 2000)); 
                } catch (e) {
                    console.log(`Erro ao enviar para ${c.nome}: ${e.message}`);
                }
            }

            res.json({ ok: true, enviados: contatos.length });
        }
    );
});

app.listen(3001, () => console.log("API rodando em http://localhost:3001"));
