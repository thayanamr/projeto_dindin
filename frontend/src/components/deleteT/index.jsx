import React, { useState } from "react";
import api from "../../pages/services/api";
import { toast } from "react-hot-toast";

import "./style.css";

function Delete({ buscarValores, setShowPopup, idRegistro2, showPopup, setLimpar, limpar }) {

  async function deletarRegistro() {
    try {
      const response = await api.delete(`/deletar?registro=${idRegistro2}`);

      console.log(response);
      buscarValores();


      setLimpar(!limpar);
      toast.success(response.data.mensagem);
    } catch (error) {
      toast.error(error.response.data.mensagem);
      console.log(error);
    }
  }


  return (
    <div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Apagar Item?</p>
            <button onClick={() => {
              deletarRegistro();
              setShowPopup(false);
            }} className="delete">
              Sim
            </button>
            <button onClick={() => setShowPopup(false)} className="close">
              Não
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delete;
