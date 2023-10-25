const { format, parseISO } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const { contas, transferencias } = require('../bancodedadosParaFrontend');
let contador = 2;
let registro = 2;
let listaTransferencias = [];
let listaParaOGrafico = {};

const verificaExiteciaDeConta = (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(404).json({ mensagem: "Email ou senha são obrigatorios!" });
        }

        const conta_encontada = contas.find((conta) => {
            return conta.usuario.email === email;
        });

        if (!conta_encontada || conta_encontada.usuario.senha !== senha) {
            return res.status(404).json({ mensagem: "Email ou senha invalidos!" })
        }

        return res.status(200).json(conta_encontada);

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}

function mostraSaldo(conta) {
    let entradas = 0;
    let saidas = 0;

    const conta_encontada = contas.find((item) => {
        return item.numero === conta;
    });

    const tranferencias_encontradas = transferencias.filter((registro) => {
        return registro.numero_conta === Number(conta_encontada.numero);
    });

    entradas = tranferencias_encontradas.filter((registro) => {
        return registro.status === true;
    }).reduce((soma, valor) => {
        return soma + valor.valor
    }, 0);


    saidas = tranferencias_encontradas.filter((registro) => {
        return registro.status === false;
    }).reduce((soma, valor) => {
        return soma + valor.valor
    }, 0);

    conta_encontada.saldo = entradas - saidas;


    const conta_saldo = {
        saldo: conta_encontada.saldo.toFixed(2).replace(".", ","),
        entrada: entradas.toFixed(2).replace(".", ","),
        saida: saidas.toFixed(2).replace(".", ",")
    }
    return conta_saldo;
}



const aplicarFitros = (req, res) => {
    let { lista, numConta, data, entrada, saida, limpar, maior, menor } = req.body;
    const listaEntradas = ['Pix', 'Vendas', 'Salario', 'TED', 'DOC', 'Deposito'];
    const listaSaidas = ['Alimentação', 'Assinatura e serviços', 'Aluguel', 'Compras', 'Educação', 'Mercado', 'Farmacia'];

    if (limpar) {
        listaTransferencias = []
        return res.status(200).json({ mensagem: "Filtro limpado com sucesso!" })
    }

    const conta_encontada = contas.find((item) => {
        return item.numero === numConta;
    });


    if (!conta_encontada) {
        return res.status(400).json({ mensagem: "Conta não encontrada!" });
    }


    //Busca valores.....

    let listaFitros = [];
    let novalista = [];
    let listaFinal = [];

    listaTransferencias = transferencias.filter((transferencia) => {
        return transferencia.numero_conta === Number(conta_encontada.numero);
    });


    if (entrada && saida) {
        //A lista ira trazer os dois tipos de transicao, sem alteracao na lista final.
        if (lista.length > 0) {
            for (let filtro_passado of lista) {
                if (listaEntradas.includes(filtro_passado) || listaSaidas.includes(filtro_passado)) {

                    for (let item of listaTransferencias) {
                        if (item.categoria === filtro_passado) {
                            novalista.push(item);
                        }
                    }

                    listaFitros = novalista;

                }
            }

            listaFitros = novalista;

            if (listaFitros.length === 0) {
                listaTransferencias = [
                    {
                        numero_conta: Number(numConta),
                        numero_registro: 1,
                        status: true,
                        data: "",
                        semana: '',
                        descricao: '',
                        categoria: '',
                        valor: null,
                    }
                ];

                return res.status(200).json({ mensagem: "Registro(s) não encontrado(s)!" })


            }

            listaTransferencias = listaFitros;
        }

    } else if (entrada) {
        const novalistaSomenteEntradas = listaTransferencias.filter((registro) => {
            return registro.status === true;
        });

        listaTransferencias = novalistaSomenteEntradas;


        if (lista.length > 0) {
            for (let filtro_passado of lista) {
                if (listaEntradas.includes(filtro_passado)) {

                    for (let item of listaTransferencias) {
                        if (item.categoria === filtro_passado) {
                            novalista.push(item);
                        }
                    }

                    listaFitros = novalista;

                }
            }

            listaFitros = novalista;

            if (listaFitros.length === 0) {

                listaTransferencias = [
                    {
                        numero_conta: Number(numConta),
                        numero_registro: 1,
                        status: true,
                        data: "",
                        semana: '',
                        descricao: '',
                        categoria: '',
                        valor: null,
                    }
                ];

                return res.status(200).json({ mensagem: "Registro(s) não encontrado(s)!" })

            }

            listaTransferencias = listaFitros;
        }


    } else if (saida) {
        const novalistaSomenteSaidas = listaTransferencias.filter((registro) => {
            return registro.status === false;
        });
        listaTransferencias = novalistaSomenteSaidas;

        if (lista.length > 0) {
            for (let filtro_passado of lista) {
                if (listaSaidas.includes(filtro_passado)) {

                    for (let item of listaTransferencias) {
                        if (item.categoria === filtro_passado) {
                            novalista.push(item);
                        }
                    }

                    listaFitros = novalista;

                }
            }

            listaFitros = novalista;

            if (listaFitros.length === 0) {
                listaTransferencias = [
                    {
                        numero_conta: Number(numConta),
                        numero_registro: 1,
                        status: true,
                        data: "",
                        semana: '',
                        descricao: '',
                        categoria: '',
                        valor: null,
                    }
                ];

                return res.status(200).json({ mensagem: "Registro(s) não encontrado(s)!" });

            }

            listaTransferencias = listaFitros;
        }
    }

    // começo function do filtro de Data.....
    if (data) {
        const ordena = listaTransferencias.map((item) => {
            const novalista = item.data.trim().split('/');
            let hora = new Date(Number(novalista[2]), Number(novalista[1] - 1), Number(novalista[0]));
            return +hora;
        });

        ordena.sort((a, b) => a - b);


        for (let i = 0; i < listaTransferencias.length; i++) {
            for (let j = 0; j < ordena.length; j++) {
                const novalista = listaTransferencias[j].data.trim().split('/');
                let hora = new Date(Number(novalista[2]), Number(novalista[1] - 1), Number(novalista[0]));
                if (ordena[i] === +hora && !(listaFinal.includes(listaTransferencias[j]))) {
                    listaFinal.push(listaTransferencias[j]);
                    break;
                }
            }
        }

        listaTransferencias = listaFinal;
    } else if (maior) {
        listaTransferencias.sort((a, b) => b.valor - a.valor);

    } else if (menor) {
        listaTransferencias.sort((a, b) => a.valor - b.valor);
    }


    if (data || entrada || saida || maior || menor) {
        return res.status(200).json({ mensagem: "lista encontrada com sucesso!" });
    }


    return res.status(200).json({ mensagem: "solicitação efetuada com sucesso!" });
}

const busca_transferencias = (req, res) => {
    const { conta } = req.query;

    try {
        const conta_encontada = contas.find((item) => {
            return item.numero === conta;
        });


        if (!conta_encontada) {
            return res.status(400).json({ mensagem: "Conta não encontrada!" });
        }

        let nomeformatado = conta_encontada.usuario.nome;
        nomeformatado = nomeformatado.trim();


        if (nomeformatado.includes(" ")) {
            nomeformatado = nomeformatado.split(' ');
            nomeformatado = nomeformatado[0];
        }

        nomeformatado = nomeformatado[0].toLocaleUpperCase() + nomeformatado.slice(1).toLocaleLowerCase();

        let buscar_listaTransferencias = transferencias.filter((transferencia) => {
            return transferencia.numero_conta === Number(conta_encontada.numero);
        });

        if (listaTransferencias.length > 0) {
            buscar_listaTransferencias = listaTransferencias;
        }

        listaParaOGrafico = buscar_listaTransferencias;

        const banco_dados = {
            lista: [...buscar_listaTransferencias],
            contaEncontrada: conta_encontada,
            movimentacao: mostraSaldo(conta),
            nome: nomeformatado
        }

        return res.status(200).json(banco_dados);
    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` })
    }
}




const criarContaFrontend = (req, res) => {
    const { nome, email, senha, senhaRepitida } = req.body;

    try {
        if (!nome || !email || !senha || !senhaRepitida) {
            return res.status(404).json({ mensagem: "Todos os campos são obrigatorios." });
        }


        const verificaEmail = contas.find((item) => {
            return item.usuario.email === email;
        });

        if (verificaEmail) {
            return res.status(404).json({ mensagem: "Email ja esta cadastrado!" });
        }

        if (senha !== senhaRepitida) {
            return res.status(404).json({ mensagem: "Senha diferentes!" });
        }

        const novoUser = {
            numero: String(++contador),
            saldo: 0,
            usuario: {
                nome,
                email,
                senha
            }
        }

        contas.push(novoUser);

        return res.status(201).json({ mensagem: "Cadastrado efetuado com sucesso!" });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}


const adicionarRegistro = (req, res) => {
    let { valor, categoria, data, descricao, status, numConta } = req.body;
    let dataformatda = new Date();
    const dias_da_semana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];


    try {
        if (!valor || !categoria || !data || !descricao) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatorios!" });
        }

        data = data.split('-');
        const mes = (data[1][0] === '0') ? data[1][1] : data[1]
        dataformatda = new Date(parseInt(data[0], 10), parseInt(mes) - 1, parseInt(data[2], 10));

        if (valor.includes(',')) {
            valor = valor.replace(',', '.');
        }

        if (isNaN(valor)) {
            return res.status(400).json({ mensagem: "Passe apenas numeros." });
        }

        const valorVerificado = Number(valor);

        if (valorVerificado < 0) {
            return res.status(400).json({ mensagem: "Valor invalido." });
        }

        const conta_encontada = contas.find((item) => {
            return item.numero === numConta;
        });

        if (!conta_encontada) {
            return res.status(404).json({ mensagem: "Conta não encontrada." });
        }

        if (conta_encontada.saldo < valorVerificado && !status) {
            return res.status(400).json({ mensagem: "Saldo insuficiente." });
        }


        conta_encontada.saldo = (status ? conta_encontada.saldo += valorVerificado : conta_encontada.saldo -= valorVerificado);
        const registroConta = {
            numero_conta: Number(numConta),
            numero_registro: ++registro,
            status,
            data: format(dataformatda, "dd/MM/yyyy", { locale: ptBR }),
            semana: dias_da_semana[dataformatda.getDay()],
            descricao,
            categoria,
            valor: valorVerificado

        }

        transferencias.push(registroConta);

        return res.status(201).json({ mensagem: "Registro adicionado com sucesso!" });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}


const editarRegistro = (req, res) => {
    let { valor, categoria, data, descricao, idRegistro, status, numConta } = req.body;
    let dataformatda = new Date();
    let entrada = 0;
    let saida = 0;



    try {
        if (!valor && !categoria && !data && !descricao) {
            return res.status(400).json({ mensagem: "Altere pelo menos um campo!" });
        }

        if (mostraSaldo(numConta).entrada.includes(',')) {
            entrada = Number(mostraSaldo(numConta).entrada.replace(",", "."));
        } else {
            entrada = Number(mostraSaldo(numConta).entrada);
        }

        if (mostraSaldo(numConta).saida.includes(',')) {
            saida = Number(mostraSaldo(numConta).saida.replace(",", "."));
        } else {
            saida = Number(mostraSaldo(numConta).saida);
        }

        if (data) {
            data = data.split('-');
            const mes = (data[1][0] === '0') ? data[1][1] : data[1]
            dataformatda = new Date(parseInt(data[0], 10), parseInt(mes) - 1, parseInt(data[2], 10));
        }

        if (valor && valor.includes(',')) {
            valor = valor.replace(',', '.');
        }

        if (isNaN(valor)) {
            return res.status(400).json({ mensagem: "Passe apenas numeros." });
        }


        if (Number(valor) < 0) {
            return res.status(400).json({ mensagem: "Valor invalido." });
        }
        valor = Number(valor);


        const registroEncontrado = transferencias.find((registro) => {
            return registro.numero_registro === idRegistro
        })


        if (!registroEncontrado) {
            return res.status(400).json({ mensagem: "Inconsistencia com o banco de dados!" });
        }

        const conta_encontada = contas.find((item) => {
            return item.numero === String(registroEncontrado.numero_conta);
        });

        if (!conta_encontada) {
            return res.status(404).json({ mensagem: "Conta não encontrada." });
        }


        if (registroEncontrado.status !== status) {
            if (!status && ((entrada - registroEncontrado.valor) - (saida + valor)) < 0) {
                return res.status(400).json({ mensagem: "Alteração invalida, Saldo insuficiente." });
            }


            if (status && ((entrada += valor) - (saida - registroEncontrado.valor)) < 0) {
                return res.status(400).json({ mensagem: "Alteração invalida, saldo insuficiente!" });
            }
        } else {
            if (!status && (entrada - (saida - registroEncontrado.valor + valor)) < 0) {
                return res.status(400).json({ mensagem: "Alteração invalida, Saldo insuficiente." });
            }


            if (status && ((entrada - registroEncontrado.valor + valor) - saida) < 0) {
                return res.status(400).json({ mensagem: "Alteração invalida, saldo insuficiente!" });
            }
        }



        if (valor) {
            registroEncontrado.valor = valor;
        }
        if (categoria) {
            registroEncontrado.categoria = categoria;
        }
        if (data) {
            registroEncontrado.data = format(dataformatda, "dd/MM/yyyy", { locale: ptBR });
        }
        if (descricao) {
            registroEncontrado.descricao = descricao;
        }

        registroEncontrado.status = status;



        return res.status(200).json({ mensagem: "Registro alterado com sucesso!" });

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }

}
const editar_perfir_Registro = (req, res) => {
    let { nome, email, senha_atual, senha, senha_repetida, numConta } = req.body;


    try {
        if (!nome && !email && !senha && !senha_repetida) {
            return res.status(400).json({ mensagem: "Altere pelo menos um campo!" });
        }

        if (!senha_atual) {
            return res.status(400).json({ mensagem: "O campo senha atual e obrigatoria" });
        }

        const conta_encontrada = contas.find((registro) => {
            return registro.numero === numConta;
        })


        if (!conta_encontrada) {
            return res.status(400).json({ mensagem: "Inconsistencia com o banco de dados!" });
        }

        if (senha !== senha_repetida) {
            return res.status(400).json({ mensagem: "Senhas novas diferentes!" });
        }



        if (conta_encontrada.usuario.senha !== senha_atual) {
            return res.status(400).json({ mensagem: "A senha atual esta incorreta!" });
        }

        if (senha === senha_atual) {
            return res.status(400).json({ mensagem: "A senha nova digitada e igual a antiga!" });
        }


        if (nome) {
            conta_encontrada.usuario.nome = nome;
        }
        if (email) {
            conta_encontrada.usuario.email = email;
        }
        if (senha) {
            conta_encontrada.usuario.senha = senha;
        }


        return res.status(200).json({ mensagem: "Registro alterado com sucesso!" });

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }

}

const deletaRegistro = (req, res) => {
    const { registro } = req.query;
    let entrada = 0;
    let saida = 0;

    try {
        const registroEncontrado = transferencias.find((item) => {
            return item.numero_registro === Number(registro);
        });

        if (!registroEncontrado) {
            return res.status(400).json({ mensagem: "Inconsistencia com o banco de dados!" });
        }

        const numConta = String(registroEncontrado.numero_conta);
        if (mostraSaldo(numConta).entrada.includes(',')) {
            entrada = Number((mostraSaldo(numConta).entrada).replace(",", "."));
        } else {
            entrada = Number(mostraSaldo(numConta).entrada);
        }

        if (mostraSaldo(numConta).saida.includes(',')) {
            saida = Number((mostraSaldo(numConta).saida).replace(",", "."));
        } else {
            saida = Number(mostraSaldo(numConta).saida);
        }


        if (!registroEncontrado.status && (entrada - (saida - registroEncontrado.valor)) < 0) {
            return res.status(400).json({ mensagem: "Alteração invalida, Saldo insuficiente." });
        }

        if (registroEncontrado.status && ((entrada - registroEncontrado.valor) - saida) < 0) {
            return res.status(400).json({ mensagem: "Alteração invalida, saldo insuficiente!" });
        }


        transferencias.splice(transferencias.indexOf(registroEncontrado), 1);
        return res.status(200).json({ mensagem: "Registro deletado com sucesso!" });

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` });
    }
}

const geraGrafico = (req, res) => {
    try {
        if (!listaParaOGrafico) {
            return res.status(400).json({ mensagem: "Sem informaçoes!" });
        }

        console.log(listaParaOGrafico);

        const listaFinalGrafico = [];

        const ordena = listaParaOGrafico.map((item) => {
            const novalista = item.data.trim().split('/');
            let hora = new Date(Number(novalista[2]), Number(novalista[1] - 1), Number(novalista[0]));
            return +hora;
        });

        ordena.sort((a, b) => a - b);


        for (let i = 0; i < listaParaOGrafico.length; i++) {
            for (let j = 0; j < ordena.length; j++) {
                const novalista = listaParaOGrafico[j].data.trim().split('/');
                let hora = new Date(Number(novalista[2]), Number(novalista[1] - 1), Number(novalista[0]));
                if (ordena[i] === +hora && !(listaFinalGrafico.includes(listaParaOGrafico[j]))) {
                    listaFinalGrafico.push(listaParaOGrafico[j]);
                    break;
                }
            }
        }

        let valores1 = [];
        let valores2 = [];
        let saldo = [];


        const ordenaDatas = listaFinalGrafico.map((registro) => {
            return registro.data;
        });


        const ordena1 = listaFinalGrafico.map((registro) => {
            return (registro.status === true) ? registro.valor : 0;
        });

        valores1 = ordena1;

        const ordena2 = listaFinalGrafico.map((registro) => {
            return (registro.status === false) ? registro.valor : 0;
        })

        valores2 = ordena2;

        let soma = 0;
        let subtrair = 0;
        let total = 0

        for (let i = 0; i < valores1.length; i++) {
            soma += valores1[i];
            subtrair += valores2[i];
            total = soma - subtrair
            saldo.push(total);
        }

        console.log(saldo);

        listaGrafico = {
            datas: [...ordenaDatas],
            valores1: [...valores1],
            valores2: [...valores2],
            saldo: [...saldo]
        }

        return res.status(200).json(listaGrafico);

    } catch (error) {
        return res.status(400).json({ mensagem: `${error}` })
    }
}


module.exports = {
    verificaExiteciaDeConta,
    busca_transferencias,
    criarContaFrontend,
    adicionarRegistro,
    editarRegistro,
    deletaRegistro,
    editar_perfir_Registro,
    aplicarFitros,
    geraGrafico
}