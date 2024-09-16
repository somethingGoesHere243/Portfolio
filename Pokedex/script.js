const outputScreen = document.getElementById('output-screen');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Collect data on full list of valid pokemon
const getData = async () => {
    try {
        const validPokemon = await fetch('https://pokeapi-proxy.freecodecamp.rocks/api/pokemon');
        const validPokemonData = await validPokemon.json();
        return validPokemonData['results'];   
    } catch (err) {
        console.log(err);
    }
}

// Collect data on a specified pokemon
const getPokemonData = async (id) => {
    try {
        const pokemonData = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${id}`);
        return await pokemonData.json();
    } catch (err) {
        console.log(err);
    }
}

const checkValidPokemonName = (name, data) => {
    for (const pokemon of Object.values(data)) {
        if (pokemon?.name === name) {
            return pokemon.id;
        }
    }
    return false;
}

const checkValidPokemonId = (num, data) => {
    for (const pokemon of Object.values(data)) {
        if (pokemon?.id === num) {
            return pokemon.id;
        }
    }
    return false;
}

// Function to capitalise a given string 
const capitalise = (str) => {
    return str[0].toUpperCase() + str.substring(1, str.length);
}

// Function to activate search and update HTML
const search = async() => {
    let validPokemonData = await getData();
    let pokemonId = false;
    //Retrieve inputted pokemon name/id 
    let input = searchInput.value;
    searchInput.value = ''
    //Check if input is an integer/id
    if (parseInt(input).toString() === input) {
        pokemonId = checkValidPokemonId(parseInt(input), validPokemonData);
    } else {
        //Convert name to lower case
        input = input.toLowerCase();
        // Remove special characters from name
        const charRegex = /[a-z \s \-]/;
        specialCharRemovedName = ''
        for (const char of input) {
            if (charRegex.test(char)) {
                specialCharRemovedName += char;
            }
        }
        // Replace white space with hyphens;
        formattedName = '';
        for (const char of specialCharRemovedName) {
            if (/\s/.test(char) && formattedName[formattedName.length - 1] !== '-') {
                formattedName += '-';
            } else if (!/\s/.test(char)) {
                formattedName += char;
            }
        }
        if (formattedName[formattedName.length - 1] === '-') {
            formattedName = formattedName.substring(0, formattedName.length - 1);
        }

        // Check if name is valid
        pokemonId = checkValidPokemonName(formattedName, validPokemonData);
    }
    if (!pokemonId) {
        alert("Pokémon not found")
        return
    }
    let pokemonData = await getPokemonData(pokemonId);
    
    
    // Check if pokemon has 1 or 2 types
    if (pokemonData['types'].length === 2) {
        // Insert into DOM
        outputScreen.innerHTML = `
        <p class="pokemon"><span id="pokemon-name">${capitalise(pokemonData['name'])}</span> (<span id="pokemon-id">#${pokemonData['id']}</span>)</p>
        <div class="divider"></div>
        <img id="sprite" src=${pokemonData['sprites']['front_default']} alt=${pokemonData['name']}>
        <div id="types"><div class="${pokemonData['types'][0]['type']['name']}" id="type1">${capitalise(pokemonData['types'][0]['type']['name'])}</div><div class="${pokemonData['types'][1]['type']['name']}" id="type2">${capitalise(pokemonData['types'][1]['type']['name'])}</div></div>
        <div id="stats">
            <div class="stat-div">Height: <span id="height">${pokemonData['height']}</span></div>
            <div class="stat-div">Weight: <span id="weight">${pokemonData['weight']}</span></div>
            <div class="stat-div">HP: <span id="hp">${pokemonData['stats'][0]['base_stat']}</span></div>
            <div class="stat-div">Speed: <span id="speed">${pokemonData['stats'][5]['base_stat']}</span></div>
            <div class="stat-div">Attack: <span id="attack">${pokemonData['stats'][1]['base_stat']}</span></div>
            <div class="stat-div">Defense: <span id="defense">${pokemonData['stats'][2]['base_stat']}</span></div>
            <div class="stat-div">Special Attack: <span id="special-attack">${pokemonData['stats'][3]['base_stat']}</span></div>
            <div class="stat-div">Special Defense: <span id="special-defense">${pokemonData['stats'][4]['base_stat']}</span></div>
        </div>
    `
    } else {
        // Insert into DOM
        outputScreen.innerHTML = `
        <p class="pokemon"><span id="pokemon-name">${capitalise(pokemonData['name'])}</span> (<span id="pokemon-id">#${pokemonData['id']}</span>)</p>
        <div class="divider"></div>
        <img id="sprite" src=${pokemonData['sprites']['front_default']} alt=${pokemonData['name']}>
        <div id="types"><div class="${pokemonData['types'][0]['type']['name']}" id="onlyType">${capitalise(pokemonData['types'][0]['type']['name'])}</div></div>
        <div id="stats">
            <div class="stat-div">Height: <span id="height">${pokemonData['height']}</span></div>
            <div class="stat-div">Weight: <span id="weight">${pokemonData['weight']}</span></div>
            <div class="stat-div">HP: <span id="hp">${pokemonData['stats'][0]['base_stat']}</span></div>
            <div class="stat-div">Speed: <span id="speed">${pokemonData['stats'][5]['base_stat']}</span></div>
            <div class="stat-div">Attack: <span id="attack">${pokemonData['stats'][1]['base_stat']}</span></div>
            <div class="stat-div">Defense: <span id="defense">${pokemonData['stats'][2]['base_stat']}</span></div>
            <div class="stat-div">Special Attack: <span id="special-attack">${pokemonData['stats'][3]['base_stat']}</span></div>
            <div class="stat-div">Special Defense: <span id="special-defense">${pokemonData['stats'][4]['base_stat']}</span></div>
        </div>
    `
    }
}

searchButton.addEventListener('click', search);

document.addEventListener('keydown', async (key) => {
    if (key.code === 'Enter') {
        search();
    }
});