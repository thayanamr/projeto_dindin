import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import exit from "../../assets/exit.png";
import Filter from "../../components/filter/index";
import AddT from "../../components/addT";
import EditProfile from "../../components/editP";
import EditarT from "../../components/editT/index";
import Delete from "../../components/deleteT/index";
import edit from "../../assets/editar.png";
import lixo from "../../assets/lixo.png";
import api from "../services/api";
import ChartComponent from "../../components/grafico/index";

import "./style.css";

function Home({ conta }) {
  const navigate2 = useNavigate();
  const [item, setItem] = useState([]);
  const [idRegistro, setIdRegistro] = useState(null);
  const [idRegistro2, setIdRegistro2] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [grafico, setGrafico] = useState(false);
  const [banco, setBanco] = useState({});
  const [name, setName] = useState("");
  const [cor, setCor] = useState(false);
  const [line, setLine] = useState(false);
  const [bar, setBar] = useState(false);

  const [limpar, setLimpar] = useState(false);

  function openModal(id) {
    setModalIsOpen(true);
    setIdRegistro(id);
  }

  function openPopup(id, id2) {
    setShowPopup(true);
    setIdRegistro2(id);
    console.log(id);
    console.log("alo", id2);
  }

  async function buscarValores() {
    try {
      const numConta = localStorage.getItem("conta");

      const response = await api.get(`/transacoes?conta=${numConta}`);
      console.log(response);

      setItem([...response.data.lista]);
      setBanco({ ...response.data.movimentacao });
      setName(response.data.nome);
    } catch (error) {
      console.log(error.response.data.mensagem);
    }
  }

  useEffect(() => {
    buscarValores();
  }, []);

  return (
    <main>
      <header>
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="profile">
          <EditProfile conta={conta} buscarValores={buscarValores} />
          <h1>{name}</h1>
          <button
            onClick={() => {
              localStorage.removeItem("autorize");
              navigate2("/");
            }}
          >
            <img className="img2" src={exit} />
          </button>
        </div>
      </header>
      <div className="container">
        <div className="content">
          <Filter
            buscarValores={buscarValores}
            setLimpar={setLimpar}
            limpar={limpar}
            grafico={grafico}
            setGrafico={setGrafico}
            setCor={setCor}
            cor={cor}
            line={line}
            setLine={setLine}
          />
          {!grafico ? (
            <div>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Semana</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {item.map((registro) => (
                    <tr key={registro.numero_registro}>
                      <td>{registro.data}</td>
                      <td>{registro.semana}</td>
                      <td>{registro.descricao}</td>
                      <td>{registro.categoria}</td>
                      <td
                        style={{
                          color: `${registro.status ? "#6460FB" : "#FA8C10"}`,
                        }}
                      >
                        R$ {Number(registro.valor).toFixed(2).replace(".", ",")}
                      </td>
                      <td>
                        <button
                          onClick={() => openModal(registro.numero_registro)}
                        >
                          <img src={edit} alt="" />
                        </button>
                        <EditarT
                          buscarValores={buscarValores}
                          idRegistro={idRegistro}
                          modalIsOpen={modalIsOpen}
                          setModalIsOpen={setModalIsOpen}
                          conta={conta}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            openPopup(registro.numero_registro, registro)
                          }
                        >
                          <img src={lixo} alt="" />
                        </button>
                        <Delete
                          buscarValores={buscarValores}
                          setShowPopup={setShowPopup}
                          idRegistro2={idRegistro2}
                          showPopup={
                            showPopup && registro.numero_registro == idRegistro2
                          }
                          setLimpar={setLimpar}
                          limpar={limpar}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<div>
            <ChartComponent item={item} limpar={limpar} buscarValores={buscarValores} grafico={grafico} cor={cor} line={line} />
          </div>)}
        </div>
        <aside>
          <div className="resume">
            <h1>Resumo</h1>
            <h3>
              Entradas:
              <strong
                style={{ color: "#6460FB" }}
              >{`R$ ${banco.entrada}`}</strong>
            </h3>
            <h3>
              Saidas:
              <strong
                style={{ color: " #FA8C10" }}
              >{`R$ ${banco.saida}`}</strong>
            </h3>
            <hr></hr>
            <h3>
              Saldo:
              <strong
                style={{ color: "#05EDE3" }}
              >{`R$ ${banco.saldo}`}</strong>
            </h3>
          </div>
          <AddT
            buscarValores={buscarValores}
            setLimpar={setLimpar}
            limpar={limpar}
          />
        </aside>
      </div>
    </main>
  );
}

export default Home;
