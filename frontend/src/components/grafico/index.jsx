import './styles.css';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Importa todas as escalas
import 'chartjs-plugin-datalabels';
import api from '../../pages/services/api';


const options = {
    scales: {
        y: {
            type: 'linear',
            beginAtZero: true,
            stepSize: 1,
        },
    },
}


function ChartComponent({ limpar, buscarValores, grafico, cor, line }) {
    const [datas, setDatas] = useState([]);
    const [valoresET, setValoresET] = useState([]);
    const [valoresSD, setValoresSD] = useState([]);
    const [saldo, setSaldo] = useState([]);

    useEffect(() => {
        buscarValores();
        gerarGrafico();
    }, [cor])


    async function gerarGrafico() {
        try {
            const response = await api.get("/gerarGrafico");
            console.log("Aquiiiiiiiiiiiiii");
            console.log(response);

            setDatas([...response.data.datas]);
            setValoresET([...response.data.valores1]);
            setValoresSD([...response.data.valores2]);
            setSaldo([...response.data.saldo]);


        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        gerarGrafico();
    }, [limpar, grafico])

    console.log(datas);
    console.log(valoresET);
    console.log(valoresSD);

    const data = {
        labels: [...datas],
        datasets: [
            {
                label: 'Transações Entradas',
                data: [...valoresET],
                fill: false,
                backgroundColor: `${line ? 'rgba(70, 35, 199,0.4)' : 'rgba(70, 35, 199,0.7)'}`,
                borderColor: '#6460FB',
                borderWidth: 2,
            },
            {
                label: 'Transações Saidas',
                data: [...valoresSD],
                fill: false,
                backgroundColor: `${line ? 'rgba(185, 111, 13,0.7)' : 'rgba(185, 111, 13,0.9)'}`,
                borderColor: '#FA8C10',
                borderWidth: 2,
            },
            {
                label: 'Saldo Transações',
                data: [...saldo],
                fill: true,
                backgroundColor: `${line ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.9)'}`,
                borderColor: '#05EDE3',
                borderWidth: 2,

            },
        ],
    };

    return (
        <div className="chart-container">
            <h2>Gráfico de Vendas Mensais</h2>
            {line ? (<Line data={data} options={options} />) : (<Bar data={data} options={options} />)}
        </div>
    );
};

export default ChartComponent;
