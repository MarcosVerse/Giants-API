import express from "express";
import cors from "cors";

import contatosRoutes from "./routes/contatos.js";   
import gruposRoutes from "./routes/grupos.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/contatos", contatosRoutes);
app.use("/api/grupos", gruposRoutes);

app.listen(3001, () => console.log("API rodando em http://localhost:3001"));