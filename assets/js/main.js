//https://hp-api.herokuapp.com/
const apiCharacters = "https://hp-api.herokuapp.com/api/characters";
//const apiSpells = ("https://hp-api.herokuapp.com/api/spells");
let charactersData = [];
let cardIdCounter = 0; //contador que garante que cada card terá um id único

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

    //retorna os dados para uso futuro
    return data;
  } catch (error) {
    // Trata os possiveis erros durante o fetch ou a conversão em JSON
    console.error("Erro fetch ou Json", error);
  }
}

//Exibir os dados na página HTML
function displayCharacterDetails(character) {
  const containerCharacterDetails = document.querySelector(".character-details");
  const cardId = `card-${cardIdCounter}`;

  console.log(cardId);
  

  const cardHtml = `
    
    <div class="card-container-character" data-id="${cardId}">
        <img src="${character.image ?  character.image : 'https://via.placeholder.com/150'}" alt="Imagem dos Personagens">
        <div class="card-container-informations">
            <div class="character-information-style">
                <p>Nome: ${character.name }</p>
                <p>Espécie: ${character.species}</p>
                <p>Casa: ${character.house}</p>
                <p>Ancestralidade: ${character.ancestry}</p>
                <div class="button-submit">
                    <button type="button" class="edit-button"
                        data-id="${cardId}">
                        Alterar Character</button>
                </div>
                <div class="button-submit">
                    <button type="button" class="delete-button"
                        data-id="${cardId}">
                        Excluir Character</button>
                </div>
            </div>
        </div>
    </div>`;

    
    containerCharacterDetails.insertAdjacentHTML('beforeend', cardHtml);
 

    document.querySelector(`.edit-button[data-id="${cardId}"]`).addEventListener('click', openEditModal);
    document.querySelector(`.delete-button[data-id="${cardId}"]`).addEventListener('click', deleteCharacterCard);

    cardIdCounter ++;
};

function createCharacterCard() {
  document.getElementById("searchButton").addEventListener("click", async () => {
      const characterName = document.getElementById("characterNameInput").value.trim();
      if (characterName) {
          const characters = charactersData.filter(item => item.name.toLowerCase() === characterName.toLowerCase());
          if (characters.length >= 0) {
              
              characters.forEach(character => displayCharacterDetails(character));
          } else {
              alert("Personagem não encontrado.");
          }
      } else {
          alert("Por favor, digite um nome de personagem.");
      }
  });
}

function setupAutocomplete(inputElement, suggestionsElement, data) {
  inputElement.addEventListener("input", () => {
    

    const query = inputElement.value.toLowerCase().trim();
    document.getElementById('autocompleteSuggestions').style.visibility='visible';
    suggestionsElement.innerHTML = "";
    

    if (query) {
      const filteredSuggestions = data.filter(character =>
        character.name.toLowerCase().includes(query));

      filteredSuggestions.forEach(character => {
       
        const suggestionElement = document.createElement("div");
        suggestionElement.className = "autocomplete-suggestion"; //sugestões da lista suspensa
        suggestionElement.textContent = character.name;
        suggestionsElement.appendChild(suggestionElement);
        suggestionElement.addEventListener("click", () => {
          inputElement.value = character.name;
          suggestionsElement.innerHTML = "";
        });
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (!suggestionsElement.contains(e.target) && e.target !== inputElement) {
      suggestionsElement.innerHTML = "";
      document.getElementById('autocompleteSuggestions').style.visibility='hidden';
    }
  });
}

//------------------------------------------------------------------------//
//MODAL

function openEditModal(event) {
  const id = event.target.dataset.id;
  const card = document.querySelector(`.card-container-character[data-id="${id}"]`);
  const characterName = card.querySelector('p:nth-child(1)').innerText.split(': ')[1];
  const character = charactersData.find(item => item.name === characterName);

  if (character) {
      document.getElementById('editName').value = character.name;
      document.getElementById('editSpecies').value = character.species;
      document.getElementById('editHouse').value = character.house;
      document.getElementById('editAncestry').value = character.ancestry;
      document.getElementById('editModal').style.display = 'block';

      document.getElementById('editCharacterForm').onsubmit = function (e) {
          e.preventDefault();
          saveCharacterChanges(character, id);
      };
  }
}

function saveCharacterChanges(character, id) {
  character.name = document.getElementById("editName").value;
  character.species = document.getElementById("editSpecies").value;
  character.house = document.getElementById("editHouse").value;
  character.ancestry = document.getElementById("editAncestry").value;

  const card = document.querySelector(`.card-container-character[data-id="${id}"]`);

  card.querySelector(".card-container-informations").innerHTML = `
   <div class="character-information-style">
        <p>Nome: ${character.name}</p>
        <p>Espécie: ${character.species}</p>
        <p>Casa: ${character.house}</p>
        <p>Ancestralidade: ${character.ancestry}</p>
       <div class="button-submit">
         <button type="button" class="edit-button" data-id="${id}">Alterar Character</button>
             </div>
        <div class="button-submit">
              <button type="button" class="delete-button" data-id="${id}">Excluir Character</button>
       </div>

    </div>`;

  document.getElementById("editModal").style.display = "none";
  

  //Após a alteração, redireciona os cliques para os novos botões (acima)
  card.querySelector('.edit-button').addEventListener('click', openEditModal);
  card.querySelector('.delete-button').addEventListener('click', deleteCharacterCard);
}

function deleteCharacterCard(event) {
  const id = event.target.dataset.id;
  const card = document.querySelector(`.card-container-character[data-id="${id}"]`);
  card.remove();
}

function openAddModal() {
  document.getElementById("addModal").style.display = "block";
}

function addNewCharacter(event) {
  event.preventDefault();

  const newCharacter = {
    name: document.getElementById("addName").value,
    species: document.getElementById("addSpecies").value,
    house: document.getElementById("addHouse").value,
    ancestry: document.getElementById("addAncestry").value,
    image: "https://via.placeholder.com/150", //Imagem do placeholder
  };
  charactersData.push(newCharacter);
  displayCharacterDetails(newCharacter);
  document.getElementById("addModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  charactersData = await getApiCharacter(apiCharacters);
  createCharacterCard();
  setupAutocomplete(
    document.getElementById("characterNameInput"),
    document.getElementById("autocompleteSuggestions"),
    charactersData
  );

  document.getElementById("addCharacterButton").addEventListener("click", openAddModal);
  document.getElementById("addCharacterForm").addEventListener("submit", addNewCharacter);
});

document.querySelectorAll('.close').forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("editModal").style.display = 'none';
    document.getElementById("addModal").style.display = 'none';
    
   

  });
});

window.onclick = function (event) {
  if (event.target === document.getElementById("editModal")) {
    document.getElementById('editModal').style.display = 'none';
    
  }
  if (event.target === document.getElementById("addModal")) {
    document.getElementById('addModal').style.display = 'none';
  }
};
