const pokemonDetail = document.getElementById("pokemonDetail");

if (!pokemonDetail) {
  throw new Error("Elemento #pokemonDetail não foi encontrado no HTML.");
}

const searchParams = new URLSearchParams(window.location.search);
const pokemonId = Number(searchParams.get("id"));

function convertPokemonToDetailModel(pokemon) {
  return {
    id: pokemon.id,
    number: String(pokemon.id).padStart(3, "0"),
    name: pokemon.name,
    types: pokemon.types.map((typeSlot) => typeSlot.type.name),

    photo:
      pokemon.sprites.other["official-artwork"].front_default ??
      pokemon.sprites.front_default,

    height: pokemon.height / 10,
    weight: pokemon.weight / 10,

    abilities: pokemon.abilities.map((abilitySlot) => {
      return abilitySlot.ability.name;
    }),

    stats: pokemon.stats.map((statSlot) => {
      return {
        name: statSlot.stat.name,
        value: statSlot.base_stat,
      };
    }),
  };
}

function formatStatName(statName) {
  const statLabels = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };

  return statLabels[statName] ?? statName;
}

function convertPokemonDetailToHtml(pokemon) {
  return `
    <article class="pokemon-detail">
      <section
        class="pokemon-detail__hero pokemon-card--${pokemon.types[0]}"
      >
        <a
          class="pokemon-detail__back"
          href="./index.html"
          aria-label="Voltar para a Pokédex"
        >
          ← Voltar
        </a>

        <div class="pokemon-detail__heading">
          <div>
            <h1 class="pokemon-detail__name">
              ${pokemon.name}
            </h1>

            <div class="pokemon-detail__types">
              ${pokemon.types
                .map(
                  (type) => `<span class="pokemon-detail__type">${type}</span>`,
                )
                .join("")}
            </div>
          </div>

          <span class="pokemon-detail__number">
            #${pokemon.number}
          </span>
        </div>

        <div class="pokemon-detail__image">
          <img
            src="${pokemon.photo}"
            alt="${pokemon.name}"
          >
        </div>
      </section>

      <div class="pokemon-detail__content">
        <section class="pokemon-detail__about">
          <h2>Sobre</h2>

          <dl class="pokemon-detail__facts">
            <div>
              <dt>Altura</dt>
              <dd>${pokemon.height} m</dd>
            </div>

            <div>
              <dt>Peso</dt>
              <dd>${pokemon.weight} kg</dd>
            </div>
          </dl>
        </section>

        <section class="pokemon-detail__abilities">
          <h2>Habilidades</h2>

          <ul>
            ${pokemon.abilities
              .map((ability) => `<li>${ability}</li>`)
              .join("")}
          </ul>
        </section>

        <section class="pokemon-detail__stats">
          <h2>Base Stats</h2>

          <ul>
            ${pokemon.stats
              .map(
                (stat) => `
                  <li>
                    <div class="pokemon-detail__stat-info">
                      <span>${formatStatName(stat.name)}</span>
                      <strong>${stat.value}</strong>
                    </div>

                    <div
                      class="pokemon-detail__stat-bar"
                      role="progressbar"
                      aria-label="${formatStatName(stat.name)}"
                      aria-valuenow="${stat.value}"
                      aria-valuemin="0"
                      aria-valuemax="255"
                    >
                      <span
                        style="width: ${Math.min(
                          (stat.value / 255) * 100,
                          100,
                        )}%"
                      ></span>
                    </div>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </section>
      </div>
    </article>
  `;
}

function loadPokemonDetail(id) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;

  pokemonDetail.innerHTML = "<p>Carregando Pokémon...</p>";

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP ao buscar Pokémon: ${response.status}`);
      }

      return response.json();
    })
    .then((pokemon) => {
      const pokemonModel = convertPokemonToDetailModel(pokemon);

      pokemonDetail.innerHTML = convertPokemonDetailToHtml(pokemonModel);

      document.title = `${pokemonModel.name} | Pokédex`;
    });
}

if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
  pokemonDetail.innerHTML = `
    <div class="pokemon-detail-message">
      <h1>Detalhes do Pokémon</h1>

      <p>Não foi possível identificar o Pokémon selecionado.</p>

      <a href="./index.html">Voltar para a Pokédex</a>
    </div>
  `;
} else {
  loadPokemonDetail(pokemonId).catch((error) => {
    console.error("Erro ao carregar detalhes do Pokémon:", error);

    pokemonDetail.innerHTML = `
      <div class="pokemon-detail-message">
        <h1>Detalhes do Pokémon</h1>

        <p>Não foi possível carregar os dados deste Pokémon.</p>

        <a href="./index.html">Voltar para a Pokédex</a>
      </div>
    `;
  });
}
