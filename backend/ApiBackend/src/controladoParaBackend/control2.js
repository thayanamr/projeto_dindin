
const { banco, contas, depositos, saques, transferencias } = require('../bancodedados');
let usuario2 = 'usuario';
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
let contador = 0;


const listaContas = (req, res) => {
    const { senha_banco } = req.query;

    try {
        if (!senha_banco) {
            return res.status(404).json({ mensagem: "Senha obrigatoria!" });
        }

        if (senha_banco[0] === banco.senha) {
            return res.status(200).json(contas);
        }

        return res.status(404).json({ mensagem: 'Senha invalida!' });
    } catch (error) {
        return res.status(400).json({ mensagem: error });
    }
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    try {
        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(404).json({ mensagem: "Todos os campos são obrigatorios." });
        }


        const verifica_cpf = contas.find((conta) => {
            return conta.usuario.cpf === cpf;
        });

        if (verifica_cpf) {
            return res.status(400).json({ mensagem: "CPF ja cadastrado!" });
        }

        const verifica_email = contas.find((conta) => {
            return conta.usuario.email === email;
        });

        if (verifica_email) {
            return res.status(400).json({ mensagem: "Email ja cadastrado!" });
        }

        if (contas[contas.length - 1]) {
            contador = Number(contas[contas.length - 1].numero);
        }

        const novoUser = {
            numero: String(++contador),
            saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
            }
        }

        contas.push(novoUser);
        return res.status(201).json(novoUser);

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}

const atualizarUsuarioConta = (req, res) => {
    let { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;


    try {
        if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
            return res.status(400).json({ mensagem: "Informe pelo menos um campo para se atualizado!" });
        }

        const contaEncontrada = contas.find((item) => {
            return item.numero === numeroConta
        });


        if (!contaEncontrada) {
            return res.status(404).json({ mensagem: "Conta nao existe!" });
        }

        let email_existe = false;
        let cpf_existe = false;

        contas.find(conta => {
            const { cpf: cpf_banco, email: email_banco } = conta.usuario;
            if (cpf_banco === cpf && (contas.indexOf(conta) !== contas.indexOf(contaEncontrada))) {
                cpf_existe = true;
            }
            if (email_banco === email && (contas.indexOf(conta) !== contas.indexOf(contaEncontrada))) {
                email_existe = true;
            }
        });

        if (cpf_existe) {
            return res.status(400).json({ mensagem: "CPF ja existe!" });
        }
        if (email_existe) {
            return res.status(400).json({ mensagem: "Email ja existe!" });
        }


        for (let campo in contaEncontrada.usuario) {
            for (let campo_passado in req.body) {
                if (campo === campo_passado && req.body[campo_passado] !== "") {
                    contaEncontrada.usuario[campo] = req.body[campo];
                }
            }
        }

        return res.status(201).json({ mensagem: "Atualizada com sucesso!" });

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` })
    }

}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;


    try {

        if (!numeroConta) {
            return res.status(400).json({ mensagem: "Numero da conta e obrigatorio!" });
        }
        const contaEncontrada = contas.find((item) => {
            return item.numero === numeroConta
        });

        if (!contaEncontrada) {
            return res.status(404).json({ mensagem: "Conta nao encontrada." });
        }

        if (contaEncontrada.saldo > 0) {
            return res.status(401).json({ mensagem: "Ainda existe saldo." });
        }

        contas.splice(contas.indexOf(contaEncontrada), 1);
        return res.status(401).json({ mensagem: "Conta apagada com sucesso." });
    } catch (error) {
        return res.status(400).json({ mensagem: error })
    }

}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    try {
        if (!numero_conta || !valor) {
            return res.status(400).json({ mensagem: "Numero da contar e valor, são obrigatorios!" });
        }

        const conta_encontrada = contas.find((item) => {
            return item.numero === numero_conta;
        });

        console.log(numero_conta, valor);

        if (!conta_encontrada) {
            return res.status(404).json({ mensagem: "Numero da conta não encontrado!" });
        }

        if (valor <= 0) {
            return res.status(400).json({ mensagem: "O valor e invalido, apenas permitido valores maiores que zero!" });
        }

        conta_encontrada.saldo += valor;

        const deposito = {
            data: format(new Date(), "dd/mm/yyyy HH:mm:ss", { locale: ptBR }),
            numero_conta,
            valor
        }

        depositos.push(deposito);

        return res.status(200).json({ mensagem: "deposito efetuado com sucesso!" });

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }

}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    try {

        if (!numero_conta || !valor) {
            return res.status(400).json({ mensagem: "Numero da contar e valor, são obrigatorios!" });
        }

        const conta_encontrada = contas.find((item) => {
            return item.numero === numero_conta
        });

        console.log(numero_conta, valor, senha);

        if (!conta_encontrada) {
            return res.status(404).json({ mensagem: "Numero conta não encontrada!" });
        }

        if (conta_encontrada.usuario.senha !== senha) {
            return res.status(404).json({ mensagem: "Senha invalida!" });
        }

        if (conta_encontrada.saldo < valor) {
            return res.status(404).json({ mensagem: "Saldo insuficiente!" });
        }

        conta_encontrada.saldo -= valor;

        const saque = {
            data: format(new Date(), "dd/mm/yyyy HH:mm:ss", { locale: ptBR }),
            numero_conta,
            valor
        }

        saques.push(saque);

        return res.status(200).json({ mensagem: "Saque efetuado com sucesso!" });



    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` })
    }

}

const tranferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;


    try {
        if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatorios!" });
        }

        const conta_origemEncontrada = contas.find((item) => {
            return item.numero === numero_conta_origem;
        });

        const conta_destinoEncontrada = contas.find((item) => {
            return item.numero === numero_conta_destino;
        });

        if (!conta_origemEncontrada) {
            return res.status(404).json({ mensagem: "Conta de origem não encontrada." });
        }

        if (!conta_destinoEncontrada) {
            return res.status(404).json({ mensagem: "Conta de destino não encontrada." });
        }

        if (conta_origemEncontrada.usuario.senha !== senha) {
            return res.status(404).json({ mensagem: "Senha invalida." });
        }

        if (conta_origemEncontrada.saldo < valor) {
            return res.status(404).json({ mensagem: "Saldo insuficiente." });
        }

        conta_origemEncontrada.saldo -= valor;
        conta_destinoEncontrada.saldo += valor;

        const transferenciaEnviadaOuRecebida = {
            data: format(new Date(), "dd/mm/yyyy HH:mm:ss", { locale: ptBR }),
            numero_conta_origem,
            numero_conta_destino,
            valor,
        }

        transferencias.push(transferenciaEnviadaOuRecebida);

        return res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }

}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    try {
        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatorios!" });
        }

        const conta_encontrada = contas.find((item) => {
            return item.numero === numero_conta[0];
        });

        if (!conta_encontrada) {
            return res.status(404).json({ mensagem: "Conta  não encontrada." });
        }

        if (conta_encontrada.usuario.senha !== senha[0]) {
            return res.status(404).json({ mensagem: "Senha invalida." });
        }

        return res.status(200).json({ mensagem: `Saldo: ${conta_encontrada.saldo}` });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    try {
        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatorios!" });
        }

        const conta_encontrada = contas.find((item) => {
            return item.numero === numero_conta[0];
        });


        if (!conta_encontrada) {
            return res.status(404).json({ mensagem: "Conta  não encontrada." });
        }

        if (conta_encontrada.usuario.senha !== senha[0]) {
            return res.status(404).json({ mensagem: "Senha invalida." });
        }

        const depositos_contaEncontrada = depositos.map((deposito) => {
            return deposito.numero_conta === numero_conta[0] ? deposito : null;
        }).filter((item) => {
            return item !== null;
        });

        const saques_contaEncontrada = saques.map((saque) => {
            return saque.numero_conta === numero_conta[0] ? saque : null;
        }).filter((item) => {
            return item !== null;
        });

        const transferenciaEnviada_contaEncontrada = transferencias.map((transferiu) => {
            return transferiu.numero_conta_origem === numero_conta[0] ? transferiu : null;
        }).filter((item) => {
            return item !== null;
        });

        const transferenciaRecebida_contaEncontrada = transferencias.map((recebeu) => {
            return recebeu.numero_conta_destino === numero_conta[0] ? recebeu : null;
        }).filter((item) => {
            return item !== null;
        });



        const extratoDeconta = {
            depositos: [...depositos_contaEncontrada],
            saques: [...saques_contaEncontrada],
            transferenciasEnviadas: [...transferenciaEnviada_contaEncontrada],
            transferenciaRecebidas: [...transferenciaRecebida_contaEncontrada],

        }


        return res.status(200).json(extratoDeconta);
    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}

module.exports = {
    listaContas,
    criarConta,
    usuario2,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    tranferir,
    saldo,
    extrato
}