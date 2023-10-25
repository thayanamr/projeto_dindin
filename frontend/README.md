<p align="center">
    <img src="./src/assets/readme-header.png">
</p>

<h1 align="center">Desafio | Front-end - Módulo 4</h1>

<p align="center">
<img src="https://img.shields.io/badge/react-framework-blue?logo=react"/>
<img src="https://img.shields.io/github/last-commit/thayanamr/projeto_dindin">
<img src="https://img.shields.io/badge/status-conclu%C3%ADdo-deploy"/>
<img src="https://img.shields.io/badge/created_by-Thayana_Machado_&_Yuri_Moura-%23c999af" >

</p>

## Descrição do Projeto

O objetivo deste desafio proposto pela Cubos Academy é replicar o website e para o seu desenvolvimento foi liberado o layout disponível no seguinte [link](https://www.figma.com/file/BwOAJkF8OeMON36TyFdhkj/DinDin-2.0?node-id=0%3A1).

Além disso, também foi disponibilizado o mapa mental com o mapeamento das funcionalidades clicando no seguinte [link](https://miro.com/app/board/uXjVPZkmV7c=/?share_link_id=902157252329).

O sistema trata-se de uma aplicação para controle de finanças pessoais. 

### Funcionalidades

:heavy_check_mark: Cadastro do usuário <br>
:heavy_check_mark: Login de usuário <br>
:heavy_check_mark: Deslogar usuário <br>
:heavy_check_mark: Cadastro de uma nova transação <br>
:heavy_check_mark: Edição de uma transação <br>
:heavy_check_mark: Exclusão de uma transação <br>
:heavy_check_mark: Listagem de transações<br>
:heavy_check_mark: Resumo das transações  (O valor de entradas, saídas e saldo é obtido por meio do endpoint de extrato da **API**)<br>
:heavy_check_mark: Permitir ordenar a tabela por data <br>
:heavy_check_mark: Permitir o usuário filtrar a tabela por categoria <br>
:heavy_check_mark: Editar perfil de usuário <br>

### Cadastro de um novo usuário:

Para cadastrar um novo usuário você terá que preencher o formulário na página de **sign-up**.

![](https://i.imgur.com/BZNNvti.png)

\*Foi garantido a exigência de que todos os campos estão preenchidos, além de que se as senha e confirmação de senha são iguais.

Ao clicar no botão **Cadastrar** você são enviados os dados do formulário para a **API** fazendo com que o sistema registre um novo usuário, caso dê certo o cadastro de um novo usuário, ele é redirecionadopara a tela de **sign-in (login)**, assim ele já poderá se logar no sistema.

### Login de usuário:

1. Na página de login de usuário, temos um botão chamado **Cadastre-se**, esse botão leva o usuário para a tela de cadastrar um novo usuário **(sign-up)**:
2. O formulário de login valida se os campos estão realmente preenchidos, se estiverem preenchidos você enviará uma requisição para a **API** para fazer o login desse usuário, é importante lembrar que existem informações como **token** e **userId** que são armazenadas no **localStorage** para que o usuário possa depois usar dentro da **área logada**.
3. Caso o login dê certo o usuário será redirecionado para a tela principal (**main**) onde ele verá a listagem de suas transações.
4. Caso o usuário esteja logado, nós devemos bloquear o acesso dele a página de login, sendo assim, somente quando o usuário estiver deslogado que poderá acessar a página **sign-in (login)**.

![](https://i.imgur.com/vvnluj6.png)


### Página principal (main):

Após o usuário fazer o login ele será redirecionado para a página principal, essa página só poderá ser acessada por usuários que estão logados na aplicação, caso contrário ao tentar acessar a página principal sem estar logado o usuário é redirecionado para a página de login (**sign-in**).

Nessa página ele verá todas as informações:

1. Header da aplicação com botões, logos e ícones.
2. Tabela com a listagem de transações.
3. Área de resumo, que traz as informações de entradas, saídas e saldos.
4. Botão para adicionar uma nova transação.
5. Botão para abrir área de filtros.

Veja na imagem abaixo:

![](https://i.imgur.com/SYm8uuY.png)

### Cadastro de uma nova transação:

Para cadastrar uma nova transação o usuário deve clicar no botão `Adicionar Registro`, que fica logo abaixo da área de `resumo`.

![](https://i.imgur.com/10q85lh.png)

Ao clicar no referido botão, um modal com a opção de adicionar informações de uma transação é exibido:

![](https://i.imgur.com/qMegn2n.png)

1. Nesse modal todas as informações devem ser preenchidas, lembrando que você pode adicionar uma `entrada` ou `saída` de dinheiro, por padrão o valor deve ser o de `saída`, caso o usuário queira adicionar um valor de entrada ele precisará clicar no botão **Entrada**.
2. O **select** de **Categoria** é preenchido com as informações de categorias que a **API** traz, ou seja, as categorias são listadas dentro do **select** com base em um **GET** na rota de **categoria** da **API.**

\*Todos os campos são obrigatórios!

Após o usuário clicar no botão **confirmar**, uma nova transação é inserida e a tabela de listagem deve ser atualizada.

É importante lembrar que quando adicionarmos uma nova transação, devemos atualizar também a área de **RESUMO**.

### Editar uma transação:

Para editar uma transação o usuário deve clicar no ícone do lápis, que se encontrará na tabela de listagem de transações:

![](https://i.imgur.com/crhos7x.png)

Esse ícone => ![](https://i.imgur.com/iFD6G3k.png)

Ao clicar no ícone de editar uma transação, o modal (que foi utilizado para adicionar uma nova transação) é aberto e as informações da transação "clicada", são preenchidas automaticamente, assim como a imagem abaixo:

![](https://i.imgur.com/UGQ9uda.png)

\*Novamente, todos os campos são obrigatórios!

Após validar os campos e o usuário clicar em confirmar, a transação é atualizada na `API`.

### Excluir uma transação:

Para excluir uma transação o usuário deve clicar no ícone da lixeira, que se encontrará na tabela de listagem de transações:

![](https://i.imgur.com/crhos7x.png)

Esse ícone => ![](https://i.imgur.com/X6GB3kh.png)

Ao clicar nesse ícone, um "popup" irá aparecer para que o usuário confirme ou não a exclusão, fazendo com que não hajam exclusões por engano, veja abaixo como aparece o "popup":

![](https://i.imgur.com/Ohhk1lhm.png)

### Listagem de transações:

As transações registradas por meio dos endpoints da `api`, são listadas numa tabela que ficará ao centro da página, nessa tabela temos 6 colunas, sendo:

1. **Data** da transação no formato `dd/mm/yyyy`
2. **Dia da semana**, nessa coluna utilizamos apenas os primeiros nomes dos dias da semana, ao invéz de Segunda-Feira, deveremos utilizamos o formato `Segunda`.
3. **Descrição**, nessa coluna listaremos as descrições informadas no cadastro de transação.
4. **Categoria**, aqui vamos mostrar as categorias inseridas em cada uma das transações cadastradas.
5. **Valor**, nessa coluna exibimos os valores de cada uma das transações. Existe uma regra importante nas cores e nos sinais, para valores de **entrada de dinheiro (credit)** exibimos o número positivo e na cor <span style="color:#7B61FF"><b>roxa</b></span>, já para **Saídas de dinheiro (debit)** exibimos o número na cor <span style="color:#FA8C10"><b>laranja</b></span>.
6. Na última coluna nós não temos um cabeçalho, nessa coluna ficarão os botões de editar e excluir.

![](https://i.imgur.com/jie9f1T.png)

Cada linha da tabela representa uma transação. Portanto cada botão representa a ação para um registro.

### Resumo das transações:

O resumo das transações são exibidos numa "box", onde temos apenas 3 informações:

- Entradas
- Saídas
- Saldo

É importante ressaltar que os valores de entrada, saída e saldos são calculados com base em um endpoint da **API** que traz o extrato das transações.

Veja na imagem abaixo, como é o resumo;
![](https://i.imgur.com/6Rlu6a7.png)

### Filtros:

A área de filtros por padrão é oculta, por quando o usuário clica no botão **Filtrar** a área de filtro é exibida e quando clicar novamente é ocultada, veja abaixo o botão que exibe/oculta a área de filtros:

![](https://i.imgur.com/GCsalqk.png)

Os filtros servem para dar granularidade aos dados, ou seja, para haver a possibilidade de exibir as transações conforme selecionamos requisitos para tal. Por exemplo, se disseremos que deve-se exibir apenas as transações da categoria **Depósito**, devemos listar na tabela somente as transações que pertencem àquela categoria.

![](https://i.imgur.com/YzXbttF.png)

Os filtros são cumulativos, ou seja, você pode filtrar por uma categoria ou por diversas categorias.

O funcionamento dos filtros segue a seguinte ordem:

1. Seleciona-se os filtros de categoria
2. Após selecionar os filtros desejados, clica-se no botão **aplicar filtros**.

Para limpar os filtros atuais, o usuário deverá clicar no botão **limpar filtros**

Veja na imagem abaixo os botões:
![](https://i.imgur.com/X43exDw.png)


### Editar perfil de usuário:

No header da aplicação existe um ícone:

![](https://i.imgur.com/q6MS5wi.png)

Ao clicar nesse ícone, deverá ser exibido um modal para edição do usuário logado.

1. O modal abre com os dados do usuário já carregados nele (menos senha e confirmação de senha)
2. Após o usuário preencher os campos ele deverá clicar em **confirmar**, caso estejam todos os campos preenchidos, você deve enviar as informações que a **API** solicita para fazer a atualização do usuário logado.
3. Após o perfil ter sido atualizado o modal é fechado.
4. Ao abrir novamente o modal, os dados do usuário devem estar atualizados.

Veja na imagem o modal já preenchido:

![](https://i.imgur.com/aWx7T9C.png)


### Logout e nome de usuário

No header da página principal **(main)** possui:

1. Um campo com o nome do usuário logado no momento.
2. Uma função para deslogar o usuário ao clicar no botão que tem uma imagem que sugere ao usuário que ele vai deslogar da aplicação.

Veja na imagem abaixo os ícones:
![](https://i.imgur.com/Njzp33e.png)

### Como executar

Pré-requisitos:

- :warning: [Node](https://nodejs.org/en/download/)

No terminal, clone o projeto:

```
git clone https://github.com/thayanamr/projeto_dindin.git
```

Apos isso instale as dependências e bibliotecas dentro da pasta `Frontend`:

```
npm install
```

Executar o projeto, dentro da pasta `Frontend`

```
npm start
```

Pelo terminal, entre na pasta `Backend` , depois na `Api Frontend` instale as dependências e bibliotecas:

```
npm install
```

Executar o projeto, dentro da pasta `Api Frontend`

```
npm start
```
