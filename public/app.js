const API_POKEMON = 'https://pokeapi.co/api/v2/pokemon';
const API_TYPE = 'https://pokeapi.co/api/v2/type';
const PAGE_SIZE = 20;

let currentPage = 1;
let pokemonList = [];
let displayedList = [];
let searchQuery = '';
let typeFilter = '';

async function init() {
    document.getElementById('loading').innerHTML = '';
    for (let i = 0; i < PAGE_SIZE; i++) {
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }

    try {
        const response = await fetch(API_TYPE);
        const data = await response.json();
        const selectElement = document.getElementById('typeFilter');

        data.results.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar tipos:', err);
    }

    loadPokemons();
}

async function loadPokemons() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const url = `${API_POKEMON}?limit=${PAGE_SIZE}&offset=${offset}`;

        let response = await fetch(url);
        let data = await response.json();

        const detailPromises = data.results.map(p => fetch(p.url));
        const detailResponses = await Promise.all(detailPromises);

        pokemonList = [];
        for (let i = 0; i < detailResponses.length; i++) {
            const pokemon = await detailResponses[i].json();
            pokemonList.push(pokemon);
        }

        displayedList = [...pokemonList];
        renderGrid();
    } catch (error) {
        console.error('Erro ao carregar Pokémons:', error);
        alert('Erro ao carregar Pokémons!');
    }
}

async function loadPokemonsByType() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        const url = `${API_TYPE}/${typeFilter}`;
        const response = await fetch(url);
        const data = await response.json();

        const limit = data.pokemon.length > 100 ? 100 : data.pokemon.length;

        const detailPromises = [];
        for (let i = 0; i < limit; i++) {
            detailPromises.push(fetch(data.pokemon[i].pokemon.url));
        }

        const detailResponses = await Promise.all(detailPromises);
        pokemonList = [];
        for (let i = 0; i < detailResponses.length; i++) {
            const pokemon = await detailResponses[i].json();
            pokemonList.push(pokemon);
        }

        displayedList = [...pokemonList];
        renderGrid();

    } catch (error) {
        console.error('Erro ao carregar tipo:', error);
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function renderGrid() {
    const gridElement = document.getElementById('pokemonGrid');
    gridElement.innerHTML = '';

    let filteredList = displayedList;
    if (searchQuery !== '') {
        filteredList = filteredList.filter(p => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(lowerCaseQuery) ||
                p.id.toString().includes(searchQuery);
        });
    }

    filteredList.forEach(p => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'col-md-3';

        const typesHtml = p.types.map(typeEntry => {
            const typeName = typeEntry.type.name;
            return `<span class="badge type-${typeName}">${typeName}</span>`;
        }).join(' ');

        const html = `
            <div class="c" onclick="showPokemonDetails(${p.id})">
                <img src="${p.sprites.front_default}" class="i" alt="${p.name}">
                <h5 class="text-center">#${p.id} ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h5>
                <div class="text-center">
                    ${typesHtml}
                </div>
            </div>
        `;

        cardContainer.innerHTML = html;
        gridElement.appendChild(cardContainer);
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    const pageInfoElement = document.getElementById('pageInfo');
    if (typeFilter !== '') {
        pageInfoElement.textContent = `Mostrando ${filteredList.length} Pokémons`;
    } else {
        pageInfoElement.textContent = `Página ${currentPage}`;
    }

    document.getElementById('prevBtn').disabled = currentPage === 1 || typeFilter !== '';
    document.getElementById('nextBtn').disabled = typeFilter !== '';
}

/* ----------------------------------------------------------------------------------------- */

async function filterByType() {
    searchQuery = document.getElementById('s').value;
    typeFilter = document.getElementById('typeFilter').value;

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if (typeFilter !== '') {
        await loadPokemonsByType();
    } else {
        renderGrid();
    }
}

function resetFilter() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    searchQuery = '';
    typeFilter = '';
    currentPage = 1;
    loadPokemons();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        if (typeFilter !== '') {
            renderGrid();
        } else {
            loadPokemons();
        }
    }
}

function nextPage() {
    currentPage++;
    if (typeFilter !== '') {
        renderGrid();
    } else {
        loadPokemons();
    }
}

function darkMode() {
    document.body.classList.toggle('dark');
}

async function showPokemonDetails(id) {
    try {
        const pokemonResponse = await fetch(API_POKEMON + '/' + id);
        const pokemon = await pokemonResponse.json();

        const speciesResponse = await fetch(pokemon.species.url);
        const species = await speciesResponse.json();

        let description = '';
        for (let i = 0; i < species.flavor_text_entries.length; i++) {
            if (species.flavor_text_entries[i].language.name === 'en') {
                description = species.flavor_text_entries[i].flavor_text;
                break;
            }
        }

        document.getElementById('modalTitle').textContent =
            '#' + pokemon.id + ' ' +
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        let html = '<div class="row"><div class="col-md-6">';
        html += '<div class="sprite-container">';
        html += '<div><img src="' + pokemon.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        html += '<div><img src="' + pokemon.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        html += '</div>';

        html += '<p><strong>Tipo:</strong> ';
        for (let i = 0; i < pokemon.types.length; i++) {
            html += '<span class="badge type-' + pokemon.types[i].type.name + '">' + pokemon.types[i].type.name + '</span> ';
        }
        html += '</p>';

        html += '<p><strong>Altura:</strong> ' + (pokemon.height / 10) + ' m</p>';
        html += '<p><strong>Peso:</strong> ' + (pokemon.weight / 10) + ' kg</p>';

        html += '<p><strong>Habilidades:</strong> ';
        for (let i = 0; i < pokemon.abilities.length; i++) {
            html += pokemon.abilities[i].ability.name;
            if (i < pokemon.abilities.length - 1) html += ', ';
        }
        html += '</p>';

        html += '</div><div class="col-md-6">';
        html += '<p><strong>Descrição:</strong></p>';
        html += '<p>' + description.replace(/\f/g, ' ') + '</p>';

        html += '<h6>Estatísticas:</h6>';
        for (let i = 0; i < pokemon.stats.length; i++) {
            let stat = pokemon.stats[i];
            let percentage = (stat.base_stat / 255) * 100;
            html += '<div><small>' + stat.stat.name + ': ' + stat.base_stat + '</small>';
            html += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }

        html += '</div></div>';

        document.getElementById('modalBody').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('m'));
        modal.show();

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar detalhes!');
    }
}

function loadPage() {
    init();
}

window.onload = loadPage;
