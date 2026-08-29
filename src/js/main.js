// ======================================================
// ARQUIVO: main.js
// CAMADA: Interface
// MÓDULO: Pokédex
// RESPONSABILIDADE:
// Iniciar a comunicação da aplicação com a PokéAPI.
//
// O QUE ESTE ARQUIVO FAZ:
// Realiza a primeira requisição HTTP para buscar os dados
// de um Pokémon e apresenta a resposta no console.
//
// IMPORTÂNCIA NO SISTEMA:
// Este arquivo será o ponto inicial da integração entre
// a interface da Pokédex e os dados fornecidos pela API.
//
// OBSERVAÇÃO ARQUITETURAL:
// Neste checkpoint os dados ainda não serão renderizados
// na interface. Primeiro validamos a comunicação com a API.
// ======================================================

const pokemonId = 1;
const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

if (!pokemonList) {
  throw new Error("Elemento #pokemonList não foi encontrado no HTML.");
}

if (!loadMoreButton) {
  throw new Error("Elemento #loadMoreButton não foi encontrado no HTML.");
}

let offset = 0;
const limit = 4;

function convertPokemonToModel(pokemonDetail) {
  const types = pokemonDetail.types.map((typeSlot) => {
    return typeSlot.type.name;
  });

  return {
    number: String(pokemonDetail.id).padStart(3, "0"),
    name: pokemonDetail.name,
    types: types,

    photo:
      pokemonDetail.sprites.other["official-artwork"].front_default ??
      pokemonDetail.sprites.front_default,
  };
}

function convertPokemonToHtml(pokemon) {
  return `
        <article class="pokemon-card pokemon-card--${pokemon.types[0]}">
            <div class="pokemon-card__info">
                <span class="pokemon-card__number">
                    #${pokemon.number}
                </span>

                <h2>${pokemon.name}</h2>

                <div class="pokemon-card__types">
                    ${pokemon.types
                      .map(
                        (type) => `<span class="pokemon-type">${type}</span>`,
                      )
                      .join("")}
                </div>
            </div>

            <div class="pokemon-card__image">
                <img
                    src="${pokemon.photo}"
                    alt="${pokemon.name}"
                >
            </div>
        </article>
    `;
}

function getPokemonDetail(pokemon) {
  return fetch(pokemon.url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erro HTTP ao buscar ${pokemon.name}: ${response.status}`,
        );
      }

      return response.json();
    })
    .then((pokemonDetail) => {
      return convertPokemonToModel(pokemonDetail);
    });
}

function getPokemons(offset, limit) {
  const listUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(listUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP ao buscar lista: ${response.status}`);
      }

      return response.json();
    })
    .then((responseBody) => {
      return responseBody.results;
    })
    .then((pokemons) => {
      const detailRequests = pokemons.map((pokemon) => {
        return getPokemonDetail(pokemon);
      });

      return Promise.all(detailRequests);
    });
}

function loadPokemonItems(offset, limit) {
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "Carregando...";

  return getPokemons(offset, limit)
    .then((pokemons) => {
      const newHtml = pokemons
        .map((pokemon) => convertPokemonToHtml(pokemon))
        .join("");

      pokemonList.insertAdjacentHTML("beforeend", newHtml);

      if (pokemons.length < limit) {
        loadMoreButton.hidden = true;
      }
    })
    .finally(() => {
      if (!loadMoreButton.hidden) {
        loadMoreButton.disabled = false;
        loadMoreButton.textContent = "Carregar mais";
      }
    });
}

loadPokemonItems(offset, limit).catch((error) => {
  console.error("Erro ao carregar Pokédex:", error);
});

loadMoreButton.addEventListener("click", () => {
  const nextOffset = offset + limit;

  loadPokemonItems(nextOffset, limit)
    .then(() => {
      offset = nextOffset;
    })
    .catch((error) => {
      console.error("Erro ao carregar mais Pokémon:", error);
    });
});
