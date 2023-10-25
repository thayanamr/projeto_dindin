import React, { useEffect, useState } from "react";
import "./style.css";
import OpeningSection from "../../components/header/headerOS.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";


function SignUp() {
  const [senhaConfirmar, setSenhaConfirmar] = useState('');
  const [status, setStatus] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    senhaRepitida: ''
  });
  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const response = await api.post('/cadastrar', form);

      toast.success(response.data.mensagem);
      console.log(response);


      setForm({
        nome: '',
        email: '',
        senha: ''
      });

      navigate('/');

    } catch (error) {
      toast.error(error.response.data.mensagem)
      console.log(error);
    }
  }

  function handleOnChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  return (
    <div className="signup-segment">
      <OpeningSection />

      <div className="content-signup">
        <form onSubmit={handleSubmit}>
          <h1>Cadastre-se</h1>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleOnChange}

          />
          <br></br>
          <label >Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleOnChange}

          />
          <br></br>
          <label >Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleOnChange}

          />
          <br></br>
          <label >Confirmação de Senha</label>
          <input
            type="password"
            name="senhaRepitida"
            value={form.senhaRepitida}
            onChange={handleOnChange}

          />

          <button className="signup-button" type="submit">Cadastrar</button>
          <Link to='/'>Já tem cadastro? Clique aqui!</Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
