import React, { useState, useEffect } from "react";
import "./style.css";
import OpeningSection from "../../components/header/headerOS.jsx";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import api from '../services/api'

function Login({ setConta }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const navigate2 = useNavigate();


  useEffect(() => {
    if (localStorage.getItem('autorize')) {
      navigate('/home');
    }
  }, []);



  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/', {
        email, senha
      });

      console.log(response);


      setEmail('');
      setSenha('');

      const numConta = response.data.numero;
      localStorage.setItem('conta', numConta);

      setConta();

      localStorage.setItem('autorize', true);
      toast.success("Acesso permitido com sucesso!");
      navigate2('/home');


    } catch (error) {
      toast.error(error.response.data.mensagem)
      console.log(error);
    }
  }

  return (
    <div className="login-segment">
      <OpeningSection class='logo' />

      <div className="content-login">
        <div className="text-login">
          <h1>
            Controle suas <span>finanças</span>, sem planilha chata.
          </h1>
          <h2>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </h2>
          <button
            onClick={() => {
              navigate("/cadastrar");
            }}
          >
            Cadastrar-se
          </button>
        </div>
        <div className="form-login">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label >Email</label>
            <br></br>
            <input
              type="text"
              placeholder=""
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br></br>

            <label >Senha</label>
            <br></br>
            <input
              type="password"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <br></br>
            <button className="login-button" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
