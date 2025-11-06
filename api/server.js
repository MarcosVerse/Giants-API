import express from "express";
import cors from "cors";

import contatosRoutes from "./routes/contatos.js";
import gruposRoutes from "./routes/grupos.js";
import enviarRoutes from "./routes/enviar.js";

const app = express();

app.use(express.json());
app.use(cors());

// Rotas
app.use("/api/contatos", contatosRoutes);
app.use("/api/grupos", gruposRoutes);
app.use("/api/enviar", enviarRoutes);

// Inicializa servidor
app.listen(3001, () => console.log("API rodando em http://localhost:3001"));
