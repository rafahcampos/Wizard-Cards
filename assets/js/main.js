//https://hp-api.herokuapp.com/
const apiCharacters = ("https://hp-api.herokuapp.com/api/characters");
//const apiSpells = ("https://hp-api.herokuapp.com/api/spells");

async function getApiCharacter(api) {
    try {
        //Realizando a requisição para a API
        const response = await fetch(api);

        //Verifica o status da requisição
        if (!response.ok) {
            throw new Error(`Erro! Status da resposta: ${response.status}`);
        }

        //Convertendo para JSON
        const data = await response.json();

        //Printando os dados
        console.log(data);

        //retorna os dados para uso futuro
        return data;
    } catch (error) {
        // Trata os possiveis erros durante o fetch ou a conversão em JSON
        console.error('Erro fetch ou Json', error);
    }
};

//Exibir os dados na página HTML
function displayCharacterDetails(data, characterName) {
    const containerCharacterDetails = document.querySelector('.character-details');

    const character = data.find(item => item.name.toLowerCase() === characterName.toLowerCase());


    if (character) {


        const html = `
        <div>
            <p>Nome: ${character.name}</p>
            <p>Casa: ${character.species}</p>
            <p>Casa: ${character.house}</p>
            <p>Ancestralidade: ${character.ancestry}</p>
        </div> `;

        //Insetir o html na div especifica
        containerCharacterDetails.innerHTML = html;
    } else {
        containerCharacterDetails.innerHTML = `<p>Personagem não encontrado</p>`
    }
}

function teste(){
    document.getElementById('searchButton').addEventListener('click', async () => {
        const characterName = document.getElementById('characterNameInput').value;
        
        if (characterName) {
            const data = await getApiCharacter(apiCharacters);
            console.log(data);
            displayCharacterDetails(data, characterName);
        } else {
            alert('Por favor, digite um nome de personagem.');
        }
    })
};





