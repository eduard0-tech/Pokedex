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
            <div class="c" onclick="showDetails(${p.id})">
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

async function f() {
    e = document.getElementById('s').value;
    f1 = document.getElementById('typeFilter').value;

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if (f1 !== '') {
        await lbt();
    } else {
        UNIFOR();
    }
}

function r() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    e = '';
    f1 = '';
    c = 1;
    l();
}

function p1() {
    if (c > 1) {
        c--;
        if (f1 !== '') {
            UNIFOR();
        } else {
            l();
        }
    }
}

function p2() {
    c++;
    if (f1 !== '') {
        UNIFOR();
    } else {
        l();
    }
}

function x() {
    document.body.classList.toggle('dark');
}

async function Minhe_nha(id) {
    try {
        var xpto = await fetch(API + '/' + id);
        var p = await xpto.json();

        var zyz = await fetch(p.species.url);
        var m = await zyz.json();

        var desc = '';
        for (var i = 0; i < m.flavor_text_entries.length; i++) {
            if (m.flavor_text_entries[i].language.name === 'en') {
                desc = m.flavor_text_entries[i].flavor_text;
                break;
            }
        }

        document.getElementById('modalTitle').textContent = '#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1);

        var ph = '<div class="row"><div class="col-md-6">';
        ph += '<div class="sprite-container">';
        ph += '<div><img src="' + p.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        ph += '<div><img src="' + p.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        ph += '</div>';

        ph += '<p><strong>Tipo:</strong> ';
        for (var i = 0; i < p.types.length; i++) {
            ph += '<span class="badge type-' + p.types[i].type.name + '">' + p.types[i].type.name + '</span> ';
        }
        ph += '</p>';

        ph += '<p><strong>Altura:</strong> ' + (p.height / 10) + ' m</p>';
        ph += '<p><strong>Peso:</strong> ' + (p.weight / 10) + ' kg</p>';

        ph += '<p><strong>Habilidades:</strong> ';
        for (var i = 0; i < p.abilities.length; i++) {
            ph += p.abilities[i].ability.name;
            if (i < p.abilities.length - 1) ph += ', ';
        }
        ph += '</p>';

        ph += '</div><div class="col-md-6">';

        ph += '<p><strong>Descrição:</strong></p>';
        ph += '<p>' + desc.replace(/\f/g, ' ') + '</p>';

        ph += '<h6>Estatísticas:</h6>';
        for (var i = 0; i < p.stats.length; i++) {
            var stat = p.stats[i];
            var percentage = (stat.base_stat / 255) * 100;
            ph += '<div><small>' + stat.stat.name + ': ' + stat.base_stat + '</small>';
            ph += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }

        ph += '</div></div>';

        document.getElementById('modalBody').innerHTML = ph;

        var mod = new bootstrap.Modal(document.getElementById('m'));
        mod.show();

    } catch (error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

function mor() {
    var x = 10;
    var y = 20;
    return x + y;
}

var gmord = 'teste miqueias';

window.onload = function () {
    i();
};