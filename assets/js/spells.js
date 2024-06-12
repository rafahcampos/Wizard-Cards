const apiSpells = "https://hp-api.herokuapp.com/api/spells";

let spellsData = [];
let spellsIdCounter = 0;

async function getApiSpells(api) {
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Erro Status da resposta: ${response.status} `);
        }
        const data = await response.json();

        console.log(data);
        return data;
    } catch (error) {
        console.error("Erro fetch ou Json", error);
    }
}

function displaySpellsDetails(spell) {
    const containerSpellDetails = document.querySelector(".spells-details");

    const existingCard = Array.from(containerSpellDetails.children).find(
        card => card.querySelector('p:nth-child(1)').innerText.split(': ')[1] === spell.name);

    if (existingCard) {
        alert("Este feitiço já foi adicionado.");
        return;
    }

    const cardId = `card-${spellsIdCounter}`;

    console.log(cardId);

    const cardHtml = `
        <div class="card-container-spell" data-id="${cardId}">
        <img src="/assets/img/spells-icon.png" alt="Imagem dos Feitiços">
            <div class="card-container-informations">
                <div class="spell-information-style">
                    <p>Spell: ${spell.name}</p>
                    <p>Descrição: ${spell.description}</p>
                    <div class="button-submit">
                        <button type="button" class="edit-button"
                             data-id="${cardId}">
                             Alterar Feitiço</button>
                    </div>
                </div>
                <div class="button-submit">
                    <button type="button" class="delete-button"
                    data-id="${cardId}">
                    Excluir Feitiço</button>
                </div>
            </div>
        </div>
    </div>`;

    containerSpellDetails.insertAdjacentHTML('beforeend', cardHtml);

    document.querySelector(`.edit-button[data-id="${cardId}"]`).addEventListener('click', openEditModal);
    document.querySelector(`.delete-button[data-id="${cardId}"]`).addEventListener(`click`, deleteSpellCard);

    spellsIdCounter++;
};

function createSpellCard() {
    document.getElementById("searchButton").addEventListener("click", async () => {
        const spellName = document.getElementById("spellNameInput").value.trim();
        if (spellName) {
            const spells = spellsData.filter(item => item.name.toLowerCase() === spellName.toLowerCase());

            if (spells.length >= 0) {

                spells.forEach(spell => displaySpellsDetails(spell));
            } else {
                alert("Feitiço não encontrado.")
            }
        } else {
            alert("Por favor, digite um nome de um feitiço.");
        }
    })
}
function setupAutocomplete(inputElement, suggestionsElement, data) {
    inputElement.addEventListener("input", () => {

        const query = inputElement.value.toLowerCase().trim();
        document.getElementById('autocompleteSuggestions').style.visibility = 'visible';
        suggestionsElement.innerHTML = "";

        if (query) {
            const filteredSuggestions = data.filter(spell =>
                spell.name.toLowerCase().includes(query));

            filteredSuggestions.forEach(spell => {

                const suggestionElement = document.createElement("div");
                suggestionElement.className = "autocomplete-suggestion";
                suggestionsElement.appendChild(suggestionElement);
                suggestionElement.addEventListener("click", () => {
                    inputElement.value = spell.name;
                    suggestionsElement.innerHTML = "";
                });
            });
        }
    });

    document.addEventListener("click", (e) => {
        if (!suggestionsElement.contains(e.target) && e.target !== inputElement) {
            suggestionsElement.innerHTML = "";
            document.getElementById('autocompleteSuggestions').style.visibility = 'hidden';
        }
    });
}

function openEditModal(event) {
    const id = event.target.dataset.id;
    const card = document.querySelector(`.card-container-spell[data-id="${id}"]`);
    const spellName = card.querySelector('p:nth-child(1)').innerText.split(': ')[1];
    const spell = spellsData.find(item => item.name === spellName);

    if(spell){
        document.getElementById('editName').value = spell.name;
        document.getElementById('editDescription').value = spell.description;
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('editSpellForm').onsubmit = function (e) {
            e.preventDefault();
            saveSpellChanges(spell, id);
        }
    }
}

function saveSpellChanges(spell, id) {
    spell.name = document.getElementById("editName").value;
    spell.description = document.getElementById("editDescription").value;

    const card = document.querySelector(`.card-container-spell[data-id="${id}"]`);

    card.querySelector(".card-container-informations").innerHTML = `
        <div class="spell-information-style">
             <p>Nome: ${spell.name}</p>
              <p>Descrição: ${spell.description}</p>
        
       <div class="button-submit">
         <button type="button" class="edit-button" data-id="${id}">Alterar Feitiço</button>
             </div>
        <div class="button-submit">
              <button type="button" class="delete-button" data-id="${id}">Excluir Feitiço</button>
       </div>
    </div>`;

    document.getElementById("editModal").style.display = "none";

    card.querySelector('.edit-button').addEventListener('click', openEditModal);
    card.querySelector('.delete-button').addEventListener('click', deleteSpellCard);
}

function deleteSpellCard(event) {
    const id = event.target.dataset.td;
    const card = document.querySelector(`.card-container-spell[data-id="${id}"]`);
  card.remove();
}

function openAddModal(){
    document.getElementById("addModal").style.display = "block";
}

function addNewSpell(event) {
    event.preventDefault();

    const newSpell = {
    name: document.getElementById("addName").value,
    description: document.getElementById("addDescription").value,
    };

    spellsData.push(newSpell);
    displaySpellsDetails(newSpell);
    document.getElementById("addModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
    spellsData = await getApiSpells(apiSpells);
    createSpellCard();
    setupAutocomplete(
        document.getElementById("spellNameInput"),
        document.getElementById("autocompleteSuggestions"),
        spellsData
    );

    document.getElementById("addSpellButton").addEventListener("click",openAddModal);
    document.getElementById("addSpellForm").addEventListener("submit", addNewSpell);
});

document.querySelectorAll('.close').forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("editModal").style.display = 'none';
        document.getElementById("addModal").style.display = 'none';
    });
});

window.onclick = function (event) {
    if(event.target === document.getElementById("editModal")){
        document.getElementById('editModal').style.display = 'none';
    }
    if (event.target === document.getElementById("addModal")) {
        document.getElementById('addModal').style.display = 'none';
    }
};