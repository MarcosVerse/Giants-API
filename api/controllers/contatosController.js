import {
    listarContatos,
    criarContato,
    atualizarContato,
    deletarContato
} from "../services/contatoService.js"; 

export const getAllContatos = async (req, res) => {
    try {
        const { nome = "", page = 1, limit = 8 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const result = await listarContatos(nome, Number(limit), Number(offset));
        // result => { data: [...], total: N }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createContato = async (req, res) => {
    try {
        const response = await criarContato(req.body);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateContato = async (req, res) => {
    try {
        const response = await atualizarContato(req.params.id, req.body);
        res.json(response);
    } catch (err) {
        if (err.message === "Contato não encontrado.")
            return res.status(404).json({ error: err.message });

        res.status(500).json({ error: err.message });
    }
};

export const deleteContato = async (req, res) => {
    try {
        const response = await deletarContato(req.params.id);
        res.json(response);
    } catch (err) {
        if (err.message === "Contato não encontrado.")
            return res.status(404).json({ error: err.message });

        res.status(500).json({ error: err.message });
    }
};
