const ServicoExercicio = require("../services/pessoa.js");
const servico = new ServicoExercicio();

class ControllerExercicio {

    async PegarUm(req, res){
        try {
            const id = req.params.id;
            const result = await servico.PegarUm(id);
            res.status(200).json(result);
        } catch (error) {
            console.log(error); // Consistente em todos os métodos se necessário, senão remover
            res.status(500).json({ message: error.message });
        }
    }

    async PegarTodos(_, res){
        try {
            const result = await servico.PegarTodos();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async Adicionar(req, res){
        try {
            const { pessoa } = req.body;

            if (!pessoa.senha) {
                return res.status(400).json({ message: "Por favor, inserir uma senha para realizar o cadastro." });
            }

            if (/[\!@#\$%\¨&\*\(\)]/.test(pessoa.nome)) {
                return res.status(400).json({ message: "O nome não deve conter caracteres especiais como !@#$%¨&*()." });
            }

            const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegExp.test(pessoa.email)) {
                return res.status(400).json({ message: "Formato de e-mail inválido!" });
            }

            await servico.Adicionar(pessoa);
            res.status(201).json({ message: "Adicionado com sucesso!"});
        } catch (error) {
            if(error.parent?.code === "ER_DUP_ENTRY") {
                return res.status(500).json({ message: "Email já cadastrado!"});
            }
            res.status(500).json({ message: error.parent?.message || error.message });
        }
    }

    async Alterar(req, res){
        try {
            const id = req.params.id;
            const nome = req.body.nome;

            if (!nome) {
                return res.status(400).json({ message: "Por favor, inserir um nome para realizar a alteração." });
            }

            if (/[\d!@#$%¨&*()]+/.test(nome)) {
                return res.status(400).json({ message: "O nome não deve conter números ou caracteres especiais EX:#" });
            }

            await servico.Alterar(id, nome);
            res.status(200).json({ message: "Alterado com sucesso!"});
        } catch (error) {
            res.status(500).json({ message: error.errors?.message || error.message });
        }
    }

    async Deletar(req, res){
        try {
            const id = req.params.id;
            await servico.Deletar(id);
            res.status(200).json({ message: "Não foi possível realizar a exclusão pois o id informado é inexistente"});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = ControllerExercicio;
