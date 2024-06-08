// adicione seu token
const token = '___aqui___'

const allStocks = [
	{ 
		bolsa: "NASDAQ",
		codigo: "AAPL",
		empresa: "Apple Inc",
		valor: 25080,
		variacao: 0.35,
		nAcoes: 40
	},
	{
		bolsa: "NASDAQ",
		codigo: "MSFT",
		empresa: "Microsoft Corp",
		valor: 50234,
		variacao: -1.5,
		nAcoes: 20
	},
	{
		bolsa: "NASDAQ",
		codigo: "META",
		empresa: "Meta Platforms Inc",
		valor: 43262,
		variacao: 2.3,
		nAcoes: 5
	},
	{
		bolsa: "NASDAQ",
		codigo: "GOOGL",
		empresa: "Alphabet Class A",
		valor: 16615,
		variacao: -0.78,
		nAcoes: 8
	},
	{
		bolsa: "NASDAQ",
		codigo: "NVDA",
		empresa: "NVIDIA Corp",
		valor: 87757,
		variacao: 0.02,
		nAcoes: 13
	}
]

function addCard({bolsa, codigo, empresa, valor, variacao, nAcoes}){
	//const {bolsa, codigo, empresa, valor, variacao, nAcoes} = stock

    const main = document.querySelector('body > main')
    
	main.innerHTML += `
        <div class="card-ticker" id="${codigo}" onmouseenter="cardEnter(event)" onmouseleave="cardLeave(event)">
			<header>
				<h2><span>${bolsa}:</span> ${codigo}</h2>
				<h1>${empresa}</h1>
			</header>
			<main>
				<p data-valor="${valor}">${dolarFormat(+valor / 100)}</p>
				<span data-variacao="${variacao}" ${ variacao < 0 ? 'style="background: #FF0000;"' : ''} >${ variacao < 0 ? '▼' : '▲'} ${variacao.toFixed(2)}%</span>
				<span>${dolarFormat(((+valor / 100)*(variacao / 100)))}</span>
			</main>
			<footer>
				<div>
					<p>${nAcoes}</p>
					<span>Ações</span>
				</div>
				<div>
					<p>${dolarFormat(nAcoes * (+valor / 100))}</p>
					<span>Posição</span>
				</div>
			</footer>
			<div class="card-menu">
				<span>Editar</span>
				<span onclick="removeCard(event)">Excluir</span>
			</div>
		</div>
    `
	const allEdit = main.querySelectorAll('.card-ticker .card-menu span:first-child')
	allEdit.forEach(edit => {
		edit.addEventListener('click', openEditModal)
	})
}

function updateCard({bolsa, codigo, empresa, valor, variacao, nAcoes}){
	//const {bolsa, codigo, empresa, valor, variacao, nAcoes} = stock

    const card = document.querySelector(`#${codigo}`)
    
	card.innerHTML = `
			<header>
				<h2><span>${bolsa}:</span> ${codigo}</h2>
				<h1>${empresa}</h1>
			</header>
			<main>
				<p data-valor="${valor}" >${dolarFormat(+valor / 100)}</p>
				<span data-variacao="${variacao}" ${ +variacao < 0 ? 'style="background: #FF0000;"' : ''} >${ +variacao < 0 ? '▼' : '▲'} ${+variacao.toFixed(2)}%</span>
				<span>${dolarFormat(((+valor / 100)*(variacao / 100)))}</span>
			</main>
			<footer>
				<div>
					<p>${nAcoes}</p>
					<span>Ações</span>
				</div>
				<div>
					<p>${dolarFormat(nAcoes * (+valor / 100))}</p>
					<span>Posição</span>
				</div>
			</footer>
			<div class="card-menu">
				<span>Editar</span>
				<span onclick="removeCard(event)">Excluir</span>
			</div>
    `

	const edit = card.querySelector('.card-ticker .card-menu span:first-child')
	edit.addEventListener('click', openEditModal)
}

function dolarFormat(valor){
	//return 'R$ ' + valor.toFixed(2).toString().replace('.',',')
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(valor)
}

function loadCards(){
	allStocks.map(stock => addCard(stock))
}

function loadTable(){
	const table = document.querySelector('#table-acoes')
	let rows = table.innerHTML
	allStocks.map(stock => {
		rows += 
			`<tr>
				<td>${stock.bolsa}</td>
				<td>${stock.codigo}</td>
				<td>${stock.empresa}</td>
				<td>${realFormat(stock.valor / 100)}</td>
				<td>${stock.variacao} %</td>
				<td>${stock.nAcoes}</td>
				<td>${realFormat((stock.valor / 100) * stock.nAcoes)}</td>
			</tr>`
	})
	table.innerHTML = rows
}

const openModal = (idModal) => {
	const modal = document.getElementById(idModal)
	modal.style.display = 'flex'
}

const closeModal = (event, id) => {
	if(id){
		const modal = document.getElementById(id)
		modal.style.display = 'none'
		return
	}

	if(event?.target?.className === "modal"){
		const modal = document.getElementById(event.target.id)
		modal.style.display = 'none'
		return
	}
}

const createCard = (event) =>{
	event.preventDefault()

	// const {bolsa, codigo, empresa, valor, variacao, nAcoes} = event.target.elements
	// const stock = {
	// 	bolsa: bolsa.value,
	// 	codigo: codigo.value,
	// 	empresa: empresa.value,
	// 	valor: valor.value,
	// 	variacao: variacao.value,
	// 	nAcoes: nAcoes.value
	// }

	const formData = new FormData(event.target)
	const stock = Object.fromEntries(formData)

	addCard(stock)
	event.target.reset()
	closeModal(null, 'add-form-modal')
}

const createApiCard = async (event) =>{
	event.preventDefault()
	const {codigo, nAcoes} = event.target.elements

	try {
		const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${codigo.value}&token=${token}`)
		const result = await response.json()

		const response2 = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${codigo.value}&token=${token}`)
		const profile = await response2.json()

		if(!response.ok || !response2.ok){
			alert('Erro ao consultar ação!')
			return
		}

		if(profile?.exchange === undefined || result?.d === null){
			alert('Ação não encontrada!')
			return
		}

		const stock = {
			bolsa: profile.exchange.split(' ')[0],
			codigo: codigo.value,
			empresa: profile?.name || '',
			valor: result.c * 100,
			variacao: result.dp,
			nAcoes: nAcoes.value
		}
		
		const card = document.getElementById(codigo.value)

		if(card){
			updateCard(stock)
		} else {
			addCard(stock)
		}
	} catch (error){
		alert('Erro ao consultar ação!')
		console.log('ERROR:', error)
	}
	
	event.target.reset()
	closeModal(null, 'add-api-modal')
}

const cardEnter = (event) => {
	const cardMenu = event.target.querySelector('.card-menu')
	cardMenu.style.display = 'flex'
}

const cardLeave = (event) => {
	const cardMenu = event.target.querySelector('.card-menu')
	cardMenu.style.display = 'none'
}

const removeCard = (event) => {
	// parentElement sobe um nível na hierarquia de elementos enquanto closest busca um seletor nos ancestrais
	// event.target.parentElement
	event.target.closest('.card-ticker').remove()
}

const openEditModal = (event) => {
	const card = event.target.closest('.card-ticker')

	const inputBolsa = document.getElementById('e-bolsa')
	inputBolsa.value = card.querySelector('header h2 span').innerText.replace(':', '')

	const inputCodigo = document.getElementById('e-codigo')
	const inputAntigoCodigo = document.getElementById('e-antigo-codigo')
	inputCodigo.value = card.querySelector('header h2').innerText.split(': ')[1]
	inputAntigoCodigo.value = card.querySelector('header h2').innerText.split(': ')[1]

	const inputEmpresa = document.getElementById('e-empresa')
	inputEmpresa.value = card.querySelector('header h1').innerText

	const inputValor = document.getElementById('e-valor')
	inputValor.value = card.querySelector('main p').dataset.valor

	const inputVariacao = document.getElementById('e-variacao')
	inputVariacao.value = card.querySelector('main > span').dataset.variacao

	const inputNAcoes = document.getElementById('e-nAcoes')
	inputNAcoes.value = card.querySelector('footer div p').innerText

	openModal('edit-form-modal')
}

const editCard = (event) =>{
	event.preventDefault()
	const formData = new FormData(event.target)
	const stock = Object.fromEntries(formData)

	const card = document.getElementById(stock['antigo-codigo'])
	card.setAttribute('id', stock.codigo)

	updateCard({
		...stock,
		valor: +stock.valor,
		variacao: +stock.variacao,
		nAcoes: +stock.nAcoes
	})
	closeModal(null, 'edit-form-modal')
}








<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harry Potter API</title>
</head>
<body>
    <div>
        <input type="text" id="characterNameInput" placeholder="Digite o nome do personagem">
        <button id="searchButton">Buscar</button>
    </div>
    <div class="character-details"></div>

    <script>
        const apiCharacters = "https://hp-api.herokuapp.com/api/characters";

        async function getApiCharacter(api) {
            try {
                const response = await fetch(api);

                if (!response.ok) {
                    throw new Error(`Erro! Status da resposta: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Erro fetch ou Json', error);
            }
        }

        function displayCharacterDetails(data, characterName) {
            const containerCharacterDetails = document.querySelector('.character-details');

            const character = data.find(item => item.name.toLowerCase() === characterName.toLowerCase());

            if (character) {
                const html = `
                    <div>
                        <h1>Nome: ${character.name}</h1>
                        <p>Casa: ${character.house}</p>
                        <p>Patrono: ${character.patronus}</p>
                        <p>Ator: ${character.actor}</p>
                        <p>Nascimento: ${character.dateOfBirth}</p>
                        <!-- Adicione outros campos conforme necessário -->
                    </div>
                `;
                containerCharacterDetails.innerHTML = html;
            } else {
                containerCharacterDetails.innerHTML = `<p>Personagem não encontrado</p>`;
            }
        }

        document.getElementById('searchButton').addEventListener('click', async () => {
            const characterName = document.getElementById('characterNameInput').value;
            if (characterName) {
                const data = await getApiCharacter(apiCharacters);
                displayCharacterDetails(data, characterName);
            } else {
                alert('Por favor, digite um nome de personagem.');
            }
        });
    </script>
</body>
</html>











<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harry Potter Characters</title>
    <style>
        .character-details {
            margin-top: 20px;
        }
        .card-container-character {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .card-container-character img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
        }
        .autocomplete-suggestions {
            border: 1px solid #ccc;
            max-height: 150px;
            overflow-y: auto;
            position: absolute;
            background-color: white;
            z-index: 1000;
        }
        .autocomplete-suggestion {
            padding: 10px;
            cursor: pointer;
        }
        .autocomplete-suggestion:hover {
            background-color: #e9e9e9;
        }
    </style>
</head>
<body>
    <h1>Buscar Personagem de Harry Potter</h1>
    <input type="text" id="characterNameInput" placeholder="Digite o nome do personagem">
    <div id="autocompleteSuggestions" class="autocomplete-suggestions"></div>
    <button id="searchButton">Buscar</button>
    <div class="character-details"></div>

    <script>
        const apiCharacters = "https://hp-api.herokuapp.com/api/characters";
        let charactersData = [];

        async function getApiCharacter(api) {
            try {
                const response = await fetch(api);
                if (!response.ok) {
                    throw new Error(`Erro! Status da resposta: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Erro fetch ou Json", error);
            }
        }

        function displayCharacterDetails(data, characterName) {
            const containerCharacterDetails = document.querySelector(".character-details");
            const character = data.find(
                (item) => item.name.toLowerCase() === characterName.toLowerCase()
            );

            if (character) {
                containerCharacterDetails.innerHTML += `
                    <div class="card-container-character">
                        <img src="${character.image}" alt="Imagem dos Personagens">
                        <div>
                            <p>Nome: ${character.name}</p>
                            <p>Espécie: ${character.species}</p>
                            <p>Casa: ${character.house}</p>
                            <p>Ancestralidade: ${character.ancestry}</p>
                        </div>
                    </div>`;
            } else {
                containerCharacterDetails.innerHTML += `<p>Personagem não encontrado</p>`;
            }
        }

        function createCharacterCard() {
            document.getElementById("searchButton").addEventListener("click", async () => {
                const characterName = document.getElementById("characterNameInput").value.trim();

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
                suggestionsElement.innerHTML = '';

                if (query) {
                    const filteredSuggestions = data.filter(character => 
                        character.name.toLowerCase().includes(query)
                    );

                    filteredSuggestions.forEach(character => {
                        const suggestionElement = document.createElement("div");
                        suggestionElement.className = "autocomplete-suggestion";
                        suggestionElement.textContent = character.name;
                        suggestionsElement.appendChild(suggestionElement);

                        suggestionElement.addEventListener("click", () => {
                            inputElement.value = character.name;
                            suggestionsElement.innerHTML = '';
                        });
                    });
                }
            });

            document.addEventListener("click", (e) => {
                if (!suggestionsElement.contains(e.target) && e.target !== inputElement) {
                    suggestionsElement.innerHTML = '';
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
    </script>
</body>
</html>
