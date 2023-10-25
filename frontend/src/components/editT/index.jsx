import { useState, React } from "react";
import Modal from "react-modal";
import CurrencyInput from "react-currency-input-field";
import x from "../../assets/x.png";
import "./style.css";
import api from "../../pages/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

Modal.setAppElement("#root");

function EditarT({ buscarValores, idRegistro, modalIsOpen, setModalIsOpen }) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("opcao1");
  const [status, setStatus] = useState(true);

  const [form, setForm] = useState({
    valor: "",
    categoria: "",
    data: "",
    descricao: ""
  })


  function closeModal() {
    setModalIsOpen(false);
  }

  const handleOpcaoClick = (opcao, e) => {
    e.stopPropagation();
    setOpcaoSelecionada(opcao);
    console.log(opcao);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const numConta = localStorage.getItem('conta');

      const response = await api.patch('/editar', {
        ...form, idRegistro, status, numConta
      });
      console.log(response);


      setForm({
        valor: "",
        categoria: '',
        data: '',
        descricao: ''
      })

      buscarValores();
      toast.success(response.data.mensagem);

      setModalIsOpen(false);
    } catch (error) {
      toast.error(error.response.data.mensagem);
    }

  }


  function handleOnChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  return (
    <div className="container-modal">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Exemple Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <form className="form-adicionarT" onSubmit={handleSubmit}>

          <div className="head">
            <h1>Editar Registro</h1>
            <button onClick={() => setModalIsOpen(false)} className="exit">
              <img src={x} alt="" />
            </button>
          </div>

          <div className="button-top">
            <button
              type="button"
              onClick={(e) => {
                handleOpcaoClick("opcao1", e),
                  setStatus(true)
              }}
              className={
                opcaoSelecionada === "opcao1" ? "selectEntrada" : "notselect"
              }
            >
              Entrada
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleOpcaoClick("opcao2", e),
                  setStatus(false)
              }}
              className={
                opcaoSelecionada === "opcao2" ? "selectSaida" : "notselect"
              }
            >
              Saída
            </button>

          </div>

          <label>Valor</label>

          <input
            type="text"
            name="valor"
            placeholder="R$ "
            value={form.valor}
            onChange={handleOnChange}
          />


          <label>Categoria</label>
          <select name="categoria" value={form.categoria} onChange={handleOnChange}>
            <option value="" >
              Escolha uma opção
            </option>
            {opcaoSelecionada === "opcao1" ? (
              <>
                <option value="Pix">Pix</option>
                <option value="Vendas">Vendas</option>
                <option value="Salario">Salario</option>
                <option value="TED">TED</option>
                <option value="Depositos">Depositos</option>
              </>
            ) : (<>
              <option value="Alimentação">Alimentação</option>
              <option value="Assinatura e serviços">Assinatura e serviços</option>
              <option value="Compras">Compras</option>
              <option value="Educação">Educação</option>
              <option value="Mercado">Compras</option>
              <option value="Aluguel">Cuidados</option>
              <option value="Farmacia">Farmacia</option>
            </>)
            }
          </select>


          <label>Data</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleOnChange}
          />

          <label>Descrição</label>
          <input
            type="text"
            name="descricao"
            value={form.descricao}
            onChange={handleOnChange}
          />
          <div className="button-confirm">
            <button className="confirm" type="submit">
              Confirmar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default EditarT;
