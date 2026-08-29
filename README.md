# Pokédex — JavaScript + PokéAPI

### Projeto Front-end | JavaScript Developer — DIO

Pokédex responsiva desenvolvida com **HTML, CSS e JavaScript puro**, consumindo dados públicos da **PokéAPI**.

O projeto faz parte dos meus estudos na formação **JavaScript Developer da DIO** e tem como objetivo consolidar conceitos fundamentais de desenvolvimento Front-end aplicados a uma aplicação real, como consumo de APIs, Promises, transformação de dados, manipulação do DOM, paginação, navegação entre páginas e tratamento de erros.

---

## 🌐 Projeto online

A aplicação está publicada com **GitHub Pages**.

### [Acessar a Pokédex](https://diegodemelo.github.io/dio-js-pokedex/)

```text
https://diegodemelo.github.io/dio-js-pokedex/
```

---

## Demonstração

### Listagem da Pokédex

![Pokédex - listagem dinâmica de Pokémon](docs/screenshots/pokedex-home.png)

---

## Sobre o projeto

A aplicação apresenta uma Pokédex dinâmica construída a partir dos dados disponibilizados pela **PokéAPI**.

Os Pokémon não são inseridos manualmente no HTML.

A interface consulta a API, transforma os dados recebidos e gera os cards dinamicamente no navegador.

Cada card apresenta:

- número do Pokémon;
- nome;
- tipo principal;
- tipos adicionais;
- artwork oficial;
- cor baseada no tipo principal.

A aplicação também possui carregamento incremental por meio do botão **Carregar mais**, permitindo adicionar novos Pokémon à listagem sem recarregar a página.

Cada card pode ser selecionado para abrir uma página individual de detalhes do Pokémon.

Na página de detalhes são apresentados:

- número;
- nome;
- tipos;
- artwork oficial;
- altura;
- peso;
- habilidades;
- atributos base;
- barras visuais para os Base Stats.

---

## Funcionalidades implementadas

- consumo da PokéAPI com `fetch`;
- validação das respostas HTTP;
- transformação dos dados retornados pela API;
- renderização dinâmica dos Pokémon;
- exibição de número, nome e tipos;
- utilização do artwork oficial disponibilizado pela PokéAPI;
- fallback para sprite quando necessário;
- identificação visual dos Pokémon pelo tipo principal;
- suporte de cores para diferentes tipos;
- carregamento incremental;
- paginação utilizando `offset` e `limit`;
- carregamento simultâneo de detalhes com `Promise.all`;
- controle do estado do botão durante as requisições;
- manipulação dinâmica do DOM;
- navegação utilizando o ID do Pokémon;
- página individual de detalhes;
- consulta dos detalhes pela PokéAPI;
- exibição de altura e peso;
- exibição de habilidades;
- apresentação dos Base Stats;
- barras visuais para os atributos;
- tratamento de ID ausente;
- tratamento de Pokémon inexistente;
- tratamento de respostas HTTP de erro;
- estados visuais de carregamento e erro;
- navegação de retorno para a Pokédex;
- layout responsivo;
- organização dos cards com CSS Grid;
- publicação com GitHub Pages.

---

## Integração com a PokéAPI

A aplicação utiliza a **PokéAPI** como fonte pública de dados.

### Endpoint principal de listagem

```text
https://pokeapi.co/api/v2/pokemon
```

A consulta utiliza os parâmetros:

```text
offset
limit
```

para controlar o carregamento incremental dos registros.

Exemplo:

```text
https://pokeapi.co/api/v2/pokemon?offset=0&limit=4
```

A primeira resposta fornece uma lista contendo o nome e a URL individual de cada Pokémon.

A aplicação utiliza essas URLs para buscar os dados completos de cada item.

O fluxo pode ser representado da seguinte forma:

```text
PokéAPI
   ↓
Lista de Pokémon
   ↓
URLs individuais
   ↓
Detalhes dos Pokémon
   ↓
Transformação dos dados
   ↓
Modelo utilizado pela aplicação
   ↓
Renderização dos cards
```

As requisições de detalhes utilizadas na listagem são agrupadas com:

```javascript
Promise.all(...)
```

permitindo aguardar todas as consultas antes de renderizar o conjunto solicitado.

---

## Transformação dos dados

Os objetos retornados pela PokéAPI possuem diversas propriedades que não são necessárias para a interface.

Por isso, a aplicação transforma as respostas da API em modelos menores contendo somente os dados utilizados pela interface.

### Modelo utilizado na listagem

Exemplo conceitual:

```javascript
{
  id: 1,
  number: "001",
  name: "bulbasaur",
  types: ["grass", "poison"],
  photo: "..."
}
```

Essa etapa ajuda a separar:

```text
estrutura da API
      ↓
dados necessários
      ↓
estrutura utilizada pela interface
```

---

## Carregamento incremental

A aplicação utiliza duas variáveis principais para controlar a paginação:

```javascript
offset;
limit;
```

O `limit` determina quantos Pokémon são carregados por requisição.

O `offset` determina a partir de qual posição a próxima consulta será realizada.

Fluxo simplificado:

```text
offset = 0
limit = 4
     ↓
#001 até #004
     ↓
Carregar mais
     ↓
offset = 4
     ↓
#005 até #008
     ↓
Carregar mais
     ↓
offset = 8
     ↓
#009 até #012
```

Os novos Pokémon são adicionados ao final da listagem existente sem remover os anteriores.

---

## Navegação por ID

Cada card possui o ID real do Pokémon retornado pela PokéAPI.

Ao selecionar um card, a aplicação navega para:

```text
detail.html?id=ID
```

Exemplo:

```text
detail.html?id=1
```

representa o Bulbasaur.

A página de detalhes utiliza:

```javascript
URLSearchParams;
```

para obter o parâmetro `id` presente na URL.

Fluxo:

```text
Card do Pokémon
      ↓
ID do Pokémon
      ↓
detail.html?id=1
      ↓
PokéAPI
      ↓
Dados completos
      ↓
Tela de detalhes
```

---

## Tela de detalhes

A página de detalhes realiza uma nova consulta utilizando o ID recebido pela URL.

Exemplo de endpoint:

```text
https://pokeapi.co/api/v2/pokemon/1
```

Os dados utilizados incluem:

```text
ID
Número
Nome
Tipos
Artwork
Altura
Peso
Habilidades
Base Stats
```

A altura e o peso retornados pela API são convertidos para unidades mais apropriadas para apresentação:

```text
altura → metros
peso   → quilogramas
```

---

## Base Stats

A tela de detalhes apresenta os principais atributos base de cada Pokémon:

```text
HP
Attack
Defense
Sp. Atk
Sp. Def
Speed
```

Além do valor numérico, cada atributo possui uma barra visual proporcional ao valor retornado pela PokéAPI.

As barras também utilizam atributos de acessibilidade relacionados a `progressbar`.

---

## Tratamento de erros

A aplicação possui tratamento para diferentes situações de falha.

Entre elas:

```text
ID ausente
ID inválido
Pokémon inexistente
Erro HTTP
Falha ao consultar a PokéAPI
```

Quando não é possível carregar um Pokémon, uma mensagem amigável é apresentada diretamente na interface.

Também é disponibilizado um link para retornar à Pokédex.

---

## Identificação visual por tipo

A cor dos cards e da área principal da tela de detalhes é definida de acordo com o primeiro tipo retornado pela PokéAPI.

Exemplos:

```text
Grass    → verde
Fire     → laranja
Water    → azul
Electric → amarelo
Bug      → verde-amarelado
```

A aplicação possui estilos para os tipos:

- normal;
- fire;
- water;
- electric;
- grass;
- ice;
- fighting;
- poison;
- ground;
- flying;
- psychic;
- bug;
- rock;
- ghost;
- dragon;
- dark;
- steel;
- fairy.

Também existe uma cor padrão de fallback para preservar a legibilidade caso algum tipo não esteja mapeado.

---

## Imagens dos Pokémon

A aplicação prioriza o **Official Artwork** fornecido pela PokéAPI.

Quando disponível, é utilizado:

```text
sprites.other["official-artwork"].front_default
```

Caso o artwork não esteja disponível, a aplicação utiliza como fallback:

```text
sprites.front_default
```

Esse comportamento evita que um Pokémon deixe de apresentar imagem quando uma das fontes não estiver disponível.

---

## Tecnologias utilizadas

| Tecnologia      | Aplicação                    |
| --------------- | ---------------------------- |
| HTML5           | Estrutura da interface       |
| CSS3            | Estilização e responsividade |
| JavaScript      | Lógica da aplicação          |
| Fetch API       | Comunicação HTTP             |
| PokéAPI         | Fonte pública de dados       |
| CSS Grid        | Organização dos cards        |
| Promises        | Fluxo assíncrono             |
| URLSearchParams | Leitura do ID na URL         |
| Git             | Controle de versão           |
| GitHub          | Hospedagem do código         |
| GitHub Pages    | Publicação da aplicação      |

O projeto foi desenvolvido **sem frameworks JavaScript**.

---

## Estrutura do projeto

```text
dio-js-pokedex/
│
├── src/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   └── detail.js
│   │
│   ├── index.html
│   └── detail.html
│
├── docs/
│   └── screenshots/
│       └── pokedex-home.png
│
├── index.html
├── .gitignore
└── README.md
```

A estrutura foi mantida simples e proporcional ao tamanho da aplicação.

O arquivo:

```text
/index.html
```

funciona como entrypoint da versão publicada pelo GitHub Pages e encaminha para:

```text
/src/index.html
```

---

## Executando o projeto localmente

Clone o repositório:

```bash
git clone https://github.com/diegodemelo/dio-js-pokedex.git
```

Entre no diretório:

```bash
cd dio-js-pokedex
```

A aplicação é composta por arquivos estáticos.

Abra:

```text
index.html
```

O arquivo funciona como entrypoint e encaminha para a aplicação disponível em:

```text
src/index.html
```

Também é possível executar o projeto utilizando uma extensão como **Live Server** no Visual Studio Code.

> A aplicação precisa de acesso à internet para consultar a PokéAPI e carregar os artworks dos Pokémon.

---

## Versão publicada

A aplicação também pode ser utilizada diretamente no navegador sem instalação:

### [Abrir Pokédex](https://diegodemelo.github.io/dio-js-pokedex/)

```text
https://diegodemelo.github.io/dio-js-pokedex/
```

A publicação é realizada utilizando **GitHub Pages**.

---

## Conceitos praticados

Durante o desenvolvimento foram praticados conceitos como:

- `const` e `let`;
- funções;
- objetos;
- arrays;
- `map`;
- `join`;
- template literals;
- Promises;
- `fetch`;
- `Promise.all`;
- tratamento de erros;
- respostas HTTP;
- JSON;
- manipulação do DOM;
- eventos;
- geração dinâmica de HTML;
- `insertAdjacentHTML`;
- paginação;
- `offset`;
- `limit`;
- fallback de dados;
- parâmetros de URL;
- `URLSearchParams`;
- navegação entre páginas;
- atributos de acessibilidade;
- CSS Grid;
- media queries;
- responsividade;
- integração com API REST;
- Git;
- branches;
- commits;
- Pull Requests;
- merge;
- GitHub;
- GitHub Pages.

---

## Fluxo da aplicação

Um dos principais aprendizados do projeto é acompanhar todo o caminho percorrido pelos dados.

### Listagem

```text
Requisição HTTP
      ↓
PokéAPI
      ↓
Resposta JSON
      ↓
Transformação dos dados
      ↓
Modelo da aplicação
      ↓
Geração do HTML
      ↓
Manipulação do DOM
      ↓
Cards da Pokédex
```

### Detalhes

```text
Card selecionado
      ↓
ID do Pokémon
      ↓
Parâmetro da URL
      ↓
Requisição HTTP
      ↓
PokéAPI
      ↓
Resposta JSON
      ↓
Transformação dos dados
      ↓
Tela de detalhes
```

Esse fluxo demonstra como dados externos podem ser transformados em componentes visuais utilizando apenas recursos nativos do navegador.

---

## Aprendizados

O desenvolvimento desta Pokédex permitiu consolidar conceitos fundamentais do desenvolvimento Front-end com JavaScript.

Entre os principais aprendizados estão:

- consumir uma API REST;
- trabalhar com operações assíncronas;
- utilizar Promises;
- interpretar respostas JSON;
- transformar estruturas externas em modelos próprios;
- criar elementos dinamicamente;
- atualizar a interface sem recarregar a página;
- implementar carregamento incremental;
- utilizar dados da API para definir elementos visuais;
- organizar uma interface responsiva;
- trabalhar com parâmetros de URL;
- navegar entre diferentes páginas da aplicação;
- tratar erros de comunicação HTTP;
- criar estados amigáveis de falha;
- diagnosticar erros utilizando o DevTools;
- evoluir uma funcionalidade em pequenos checkpoints;
- utilizar branches para isolar alterações;
- utilizar Pull Requests para revisar mudanças;
- realizar merge de funcionalidades validadas;
- publicar uma aplicação estática com GitHub Pages;
- utilizar Git e GitHub como parte do fluxo de desenvolvimento.

---

## Evolução do projeto

O desenvolvimento foi realizado de forma incremental.

```text
Interface estática
      ↓
Primeira requisição à PokéAPI
      ↓
Transformação dos dados
      ↓
Primeiro Pokémon dinâmico
      ↓
Múltiplos Pokémon
      ↓
Endpoint de listagem
      ↓
Paginação com offset e limit
      ↓
Carregamento incremental
      ↓
Cores por tipo
      ↓
Official Artwork
      ↓
Refinamento visual
      ↓
Navegação por ID
      ↓
Tela de detalhes
      ↓
Altura, peso e habilidades
      ↓
Base Stats
      ↓
Tratamento de erros
      ↓
GitHub Pages
```

Essa abordagem permite validar cada comportamento antes de adicionar uma nova funcionalidade.

---

## Próximas evoluções

O projeto já possui seu fluxo principal funcional e publicado.

Algumas evoluções que podem ser exploradas futuramente são:

- pesquisa de Pokémon por nome;
- filtro por tipo;
- revisão adicional de acessibilidade;
- melhorias adicionais de contraste;
- refinamentos de responsividade;
- otimização do carregamento das imagens;
- melhoria dos estados visuais de carregamento;
- novas informações na página de detalhes;
- navegação entre Pokémon anterior e próximo;
- tratamento visual adicional para indisponibilidade temporária da API.

Essas melhorias não são necessárias para o funcionamento atual da aplicação e representam possíveis evoluções do projeto.

---

## Git e fluxo de desenvolvimento

O projeto utiliza Git e GitHub para controle de versão.

As evoluções mais relevantes são desenvolvidas em branches separadas e integradas à `main` após validação.

Exemplos de funcionalidades desenvolvidas dessa forma:

```text
feature/pokemon-details
fix/github-pages-entrypoint
```

O fluxo utilizado inclui:

```text
Branch
   ↓
Implementação
   ↓
Validação
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Merge
   ↓
QA pós-merge
   ↓
Publicação
```

---

## GitHub Pages

A Pokédex está publicada através do GitHub Pages.

URL:

```text
https://diegodemelo.github.io/dio-js-pokedex/
```

Como a aplicação principal está dentro de:

```text
src/
```

o repositório possui um `index.html` na raiz utilizado como entrypoint da publicação.

Fluxo:

```text
GitHub Pages
      ↓
/index.html
      ↓
/src/index.html
      ↓
Pokédex
```

---

## Projeto educacional

Este projeto foi desenvolvido como parte dos meus estudos na formação **JavaScript Developer da DIO**.

Seu objetivo é educacional, com foco no aprendizado e na prática de desenvolvimento Front-end utilizando JavaScript.

A aplicação utiliza a **PokéAPI** como fonte pública de dados.

Pokémon, nomes, personagens, imagens e demais propriedades relacionadas pertencem aos seus respectivos titulares e são utilizados neste projeto somente para fins de estudo.

---

## Status

**Funcional e publicado.**

Atualmente estão implementados:

```text
Listagem dinâmica
+
Consumo da PokéAPI
+
Transformação dos dados
+
Cards por tipo
+
Official Artwork
+
Paginação incremental
+
Navegação por ID
+
Tela de detalhes
+
Altura e peso
+
Habilidades
+
Base Stats
+
Tratamento de erros
+
Layout responsivo
+
GitHub Pages
```

### Aplicação online

[https://diegodemelo.github.io/dio-js-pokedex/](https://diegodemelo.github.io/dio-js-pokedex/)

---

## Autor

**Diego de Melo**

Desenvolvedor Full Stack Júnior

**Stack:** JavaScript • TypeScript • React • Next.js • Node.js • PostgreSQL

**LinkedIn:** [Diego de Melo](https://www.linkedin.com/in/diegodemelodev)

**GitHub:** [@diegodemelo](https://github.com/diegodemelo)

---

### HTML • CSS • JavaScript • PokéAPI
