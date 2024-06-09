//https://hp-api.herokuapp.com/
const apiCharacters = "https://hp-api.herokuapp.com/api/characters";
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
    // console.log(data);

    //retorna os dados para uso futuro
    return data;
  } catch (error) {
    // Trata os possiveis erros durante o fetch ou a conversão em JSON
    console.error("Erro fetch ou Json", error);
  }
}

//Exibir os dados na página HTML
function displayCharacterDetails(data, characterName) {
  const containerCharacterDetails =
    document.querySelector(".character-details");

  const character = data.find(
    (item) => item.name.toLowerCase() === characterName.toLowerCase() //verifica se encontrado
  );

  if (character) {
    containerCharacterDetails.innerHTML += `
          <b>
                    <div class="card-container-character">
                        <img src="${character.image}"
                            alt="Imagem dos Personagens">
                        <div class="card-container-informations">
                            <b>
                                <div>
                                    <p>Nome: ${character.name}</p>
                                    <p>Espécie: ${character.species}</p>

                                    <p>Casa: ${character.house}</p>
                                    <p>Ancestralidade: ${character.ancestry}</p>
                                    <div  class="button-submit" >
                                        <button type="submit">Alterar
                                            Character</button>
                                        </div>
                                        <div class="button-submit">
                                        <button  type="submit">Excluir
                                            Character</button>
                                    </div>
                                </div>
                            </b>
                        </div>
                    </div>
                </b>`;

    //Insetir o html na div especifica
  } else {
    containerCharacterDetails.innerHTML += `<p>Personagem não encontrado</p>`;
  }
}

function createCharacterCard() {
  document
    .getElementById("searchButton")
    .addEventListener("click", async () => {
      const characterName = document
        .getElementById("characterNameInput")
        .value.trim();

      if (characterName) {
        displayCharacterDetails(charactersData, characterName);
      } else {
        alert("Por favor, digite um nome de personagem.");
      }
    });
}

function setupAutocomplete(inputElement, suggestionsElement, data) {
  inputElement.addEventListener("input", () => {
    const query = inputElement.value.toLowerCase().trim();
    suggestionsElement.innerHTML = "";

    if (query) {
      const filteredSuggestions = data.filter((character) =>
        character.name.toLowerCase().includes(query)
      );

      filteredSuggestions.forEach((character) => {
        const suggestionElement = document.createElement("div");
        suggestionElement.className = "autocomplete-suggestion";
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
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  charactersData = await getApiCharacter(apiCharacters);
  createCharacterCard();
  setupAutocomplete(
    document.getElementById("characterNameInput"),
    document.getElementById("autocompleteSuggestions"),
    charactersData
  );
});

//------------------------------------------------------------------------//
//MODAL

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");

  const openModalButton = document.getElementById("openModalButton");

  const closeModalButton = modal.querySelector(".close");

  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  openModalButton.addEventListener("click", openModal);

  closeModalButton.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      closeModal();
    }
  });
});
