import { useState, React } from "react";
import Modal from "react-modal";
import x from "./../../assets/x.png";
import "./style.css";
import profile from "./../../assets/profile.png";
import api from "../../pages/services/api";
import { toast } from "react-hot-toast";

Modal.setAppElement("#root");

function EditProfile({ conta, buscarValores }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha_atual: "",
    senha: "",
    senha_repetida: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const numConta = localStorage.getItem('conta');

      const response = await api.patch('/editarPerfil', {
        ...form, numConta
      });
      console.log(response);


      setForm({
        nome: "",
        email: "",
        senha_atual: "",
        senha: "",
        senha_repetida: "",
      });

      buscarValores();
      closeModal();

      toast.success(response.data.mensagem);
    } catch (error) {
      toast.error(error.response.data.mensagem);
    }
  }

  function handleOnChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  return (
    <div className="container-modal">
      <button onClick={openModal}>
        <img src={profile} alt="" />
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Exemple Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <form onSubmit={handleSubmit} className="form-adicionarP">
          <div className="head">
            <h1>Editar Perfil</h1>
            <button onClick={closeModal} className="exit">
              <img src={x} alt="" />
            </button>
          </div>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleOnChange}
          />
          <label>Email</label>

          <input
            type="text"
            placeholder=""
            name="email"
            value={form.email}
            onChange={handleOnChange}
          />

          <label>Senha atual  <span> *Campo obrigatorio</span></label>

          <input
            type="password"
            name="senha_atual"
            value={form.senha_atual}
            onChange={handleOnChange}
          />

          <label>Senha nova</label>

          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleOnChange}
          />

          <label>Confirmação de Senha</label>
          <input
            type="password"
            name="senha_repetida"
            value={form.senha_repetida}
            onChange={handleOnChange}
          />
          <div className="button-confirm">
            <button className="confirm" type="submit">
              Entrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default EditProfile;
