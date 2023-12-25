// Since the API does not provide types' color
const typeToColorMapper = new Map([
  ["grass", ["#9bcc50"]],
  ["poison", ["#b97fc9"]],
  ["fire", ["#fd7d24"]],
  ["water", ["#4592c4"]],
  ["bug", ["#729f3f"]],
  ["flying", ["#3dc7ef", "#bdb9b8"]],
]);

function isDark(color) {
  const c = color.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 150) {
    return true;
  }
}

function renderPokemonTypes(pokemon) {
  return pokemon.types
    .map(({ type }) => {
      const [color1, color2 = color1] = typeToColorMapper.get(type.name);
      return `
        <span
          class="pokes__type"
          style="
            background: linear-gradient(180deg, ${color1} 50%, ${color2} 50%);
            color: ${isDark(color1) ? "#ffffff" : "#000000"};
          ">
          ${type.name}
        </span>
      `;
    })
    .join("");
}

function renderPokemonList(pokemons) {
  const pokesInnerHTML = pokemons.reduce((acc, pokemon) => {
    return (
      acc +
      `
        <article class="pokes__article">
          <div class="pokes__img-container">
            <img
              class="pokes__img"
              src="${pokemon.sprites.other.dream_world.front_default}"
              alt="${pokemon.name}"
            />
          </div>
          <p class="pokes__tag">#${pokemon.id.toString().padStart("0", 4)}</p>
          <h2 class="pokes__name">${pokemon.name}</h2>
          <div class="pokes__types">${renderPokemonTypes(pokemon)}</div>
        </article>
      `
    );
  }, "");

  document.getElementById("pokes").innerHTML = pokesInnerHTML;
}

async function fetchPokes() {
  const requests = new Array(12).fill().map((_, index) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`)
      .then((res) => res.json())
      .catch((err) => console.log(err))
  );

  const pokemons = await Promise.all(requests);
  renderPokemonList(pokemons);
}

fetchPokes();
