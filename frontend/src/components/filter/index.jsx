import React, { useEffect, useState } from "react";
import filter from "./../../assets/filter.png";
import "./style.css";
import plus from "./../../assets/+.png";
import xwhite from "./../../assets/x-white.png";
import api from "../../pages/services/api";
import { toast } from "react-hot-toast";

const fitroEntradas = [
  {
    nome: 'Pix',
    status: false
  },
  {
    nome: 'Vendas',
    status: false
  },
  {
    nome: 'Salario',
    status: false
  }, {
    nome: 'TED',
    status: false
  }, {
    nome: 'DOC',
    status: false
  }, {
    nome: 'Deposito',
    status: false
  }
]
const fitroSaidas = [
  {
    nome: 'Alimentação',
    status: false
  },
  {
    nome: 'Assinatura e serviços',
    status: false
  },
  {
    nome: 'Aluguel',
    status: false
  }, {
    nome: 'Compras',
    status: false
  }, {
    nome: 'Educação',
    status: false
  }, {
    nome: 'Mercado',
    status: false
  }, {
    nome: 'Farmacia',
    status: false
  }
]

function Filter({ buscarValores, setLimpar, limpar, grafico, setGrafico, setCor, cor, line, setLine }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState([]);
  const [data, setData] = useState(false);
  const [entrada, setEntrada] = useState(false);
  const [saida, setSaida] = useState(false);
  const [teste, setTeste] = useState(false);
  const [maior, setMaior] = useState(false);
  const [menor, setMenor] = useState(false);
  const [obj, setObj] = useState({
    lista: []
  });

  useEffect(() => {
    setObj({ ...obj, lista: [...filtroSelecionado] });
  }, [filtroSelecionado]);

  const handleFiltroClick = (filtro) => {
    setFiltroSelecionado(filtro);
    setTeste(!teste);
  };

  const handleFiltroClickRemove = (item) => {
    filtroSelecionado.splice(filtroSelecionado.indexOf(item), 1);
    setFiltroSelecionado([...filtroSelecionado]);
    setTeste(!teste);
    console.log(filtroSelecionado);
  };

  function filtraEntrda() {
    setMaior(!maior);
    setMenor(false);
    setData(false);
    for (let item of fitroEntradas) {
      item.status = false;
    }
  }

  function filtraSaida() {
    setMenor(!menor);
    setMaior(false);
    setData(false);
    for (let item of fitroSaidas) {
      item.status = false;
    }
  }

  const openFilter = () => {
    setShowFilter(!showFilter);
    console.log("abrir/fechar");
  };

  function limparFiltro() {
    handleFiltroClick([]);
    setCor(false);
    setData(false);
    setEntrada(false);
    setSaida(false);
    setMaior(false);
    setMenor(false);
    for (let item of fitroEntradas) {
      item.status = false;
    }
    for (let item of fitroSaidas) {
      item.status = false;
    }
    setLimpar(!limpar);
  }

  async function buscarFiltros() {
    try {

      const numConta = localStorage.getItem('conta');

      const response = await api.post('/filtros', {
        ...obj, numConta, data, entrada, saida, limpar, maior, menor
      });

      console.log(response);

      buscarValores();
      setLimpar(false);
      if (response.data.mensagem === "lista encontrada com sucesso!") {
        toast.success(response.data.mensagem);
      } else if (response.data.mensagem === "Registro(s) não encontrado(s)!") {
        toast.error(response.data.mensagem);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.mensagem);
    }
  }

  useEffect(() => {
    buscarFiltros();
  }, [limpar, cor]);


  return (
    <div>
      <button onClick={openFilter} className="filter">
        <img src={filter} alt="" /> Filtrar
      </button>

      {showFilter && (
        <div className="filter-container">
          <h2>Categoria</h2>
          <div className="button-filters">
            <div className="data">
              <button
                type="button"
                onClick={() => {
                  setData(!data);
                  setMaior(false);
                  setMenor(false);
                }}
                className={
                  data ? "select4" : "notselect"
                }
              >
                Data
                <img style={{ marginLeft: '4px' }}
                  src={data ? xwhite : plus}
                  alt=""
                />
              </button>
              <button
                type="button"
                onClick={() => filtraEntrda()}
                className={
                  maior ? "select4" : "notselect"
                }
              >
                Maior valor
                <img style={{ marginLeft: '4px' }}
                  src={maior ? xwhite : plus}
                  alt=""
                />
              </button>
              <button
                type="button"
                onClick={() => filtraSaida()}
                className={
                  menor ? "select4" : "notselect"
                }
              >
                Menor valor
                <img style={{ marginLeft: '4px' }}
                  src={menor ? xwhite : plus}
                  alt=""
                />
              </button>
            </div>


            <div className="entrada">
              <button
                type="button"
                onClick={() => setEntrada(!entrada)}
                className={
                  entrada ? "select1" : "notselect"
                }
              >
                Entradas
                <img style={{ marginLeft: '4px' }}
                  src={entrada ? xwhite : plus}
                  alt=""
                />
              </button>

              {entrada &&
                (
                  <div key={teste}>{
                    fitroEntradas.map((item, id) => (
                      <div key={item.nome}>
                        <button type="button"
                          onClick={() => {
                            if (!item.status) {
                              handleFiltroClick([...filtroSelecionado, item.nome]);
                              item.status = true;
                            } else {
                              handleFiltroClickRemove(item.nome);
                              item.status = false;
                            }
                          }}
                          className={item.status ? "select1" : "notselect"}
                        >
                          {item.nome}{" "}
                          <img style={{ marginLeft: '4px' }} src={item.status ? xwhite : plus} alt="" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            <div className="saida">
              <button
                type="button"
                onClick={() => setSaida(!saida)}
                className={
                  saida ? "select2" : "notselect"
                }
              >
                Saidas{" "}
                <img style={{ marginLeft: '4px' }}
                  src={saida ? xwhite : plus}
                  alt=""
                />
              </button>


              {saida &&
                (
                  <div key={teste}>{
                    fitroSaidas.map((item, id) => (
                      <div key={item.nome}>
                        <button type="button"
                          onClick={() => {
                            if (!item.status) {
                              handleFiltroClick([...filtroSelecionado, item.nome]);
                              item.status = true;
                            } else {
                              handleFiltroClickRemove(item.nome);
                              item.status = false;
                            }
                          }}
                          className={item.status ? "select2" : "notselect"}
                        >
                          {item.nome}{" "}
                          <img style={{ marginLeft: '4px' }} src={item.status ? xwhite : plus} alt="" />
                        </button>
                      </div>
                    ))
                  }</div>
                )
              }
            </div>

            <hr id="hr" />

            <div id="grafico">
              <button
                type="button"
                onClick={() => setGrafico(!grafico)}
                className={
                  grafico ? "select5" : "notselect"
                }
              >
                Grafico
                <img style={{ marginLeft: '4px' }}
                  src={grafico ? xwhite : plus}
                  alt=""
                />
              </button>
              {grafico && (<div>
                <button
                  type="button"
                  onClick={() => setLine(!line)}
                  className={
                    line ? "select6" : "notselect"
                  }
                >
                  Line
                  <img style={{ marginLeft: '4px' }}
                    src={line ? xwhite : plus}
                    alt=""
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setLine(!line)}
                  className={
                    !line ? "select6" : "notselect"
                  }
                >
                  Bar
                  <img style={{ marginLeft: '4px' }}
                    src={!line ? xwhite : plus}
                    alt=""
                  />
                </button>
              </div>)}
            </div>


          </div>

          <div className="add-filters">
            <button className="button1" onClick={() => limparFiltro()}>
              Limpar Filtros
            </button>
            <button onClick={() => setCor(!cor)} className={cor ? "button4" : "button2"}>Aplicar Filtros</button>
          </div>
        </div>
      )
      }
    </div >
  );
};


export default Filter;
