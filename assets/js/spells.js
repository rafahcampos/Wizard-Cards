const apiSpells = "https://hp-api.herokuapp.com/api/spells";

let spellsData = [];
let spellsCounter = 0;

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

function displayStellsDetails (spell){
    const containerSpellDetails = document.querySelector(".spells-details");

    const existingCard = Array.from(containerSpellDetails.children).find(
        card => card.querySelector('p:nth-child(1)'.innerText.split(': ')[1] === spell.name);

    );

    if (existingCard){
        alert("Este feitiço já foi adicionado.");
        return;
    }

    const cardId = `card-${cardIdCounter}`;

    console.log(cardId);

    const cardHtml = `
        <div class="card-container-character" data-id="${cardId}">
            <div class="card-container-informations">
                <div class="character-information-style">
                    <p>Spell: ${spell.name }</p>
                    <p>Descrição: ${spell.description}</p>
                    <div class="button-submit">
                        <button type="button" class="edit-button"
                             data-id="${cardId}">Alterar Spell</button>
                    </div>
                </div>
                <div class="button-submit">
                    <button type="button" class="delete-button"
                    data-id="${cardId}">
                    Excluir Spell</button>
                </div>
            </div>
        </div>
    </div>`;

    containerSpellDetails.insertAdjacentHTML('beforeend', cardHtml);

    
}
