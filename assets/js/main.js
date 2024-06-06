//https://hp-api.herokuapp.com/
const api = ("https://hp-api.herokuapp.com/api/characters");

async function getAPi(api) {
    try {
        //Realizando a requisição para a API
        const response = await fetch(api);

        //Verifica o status da requisição
        if (!response.ok) {
            throw new Error(`Erro! Status da reponsta: ${response.status}`);
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
function displayApiData(data) {
    const containerCharacterName = document.querySelector('.character-name');

    if (data) {
        const html = data.map(item => `
        <div>
         <h1>
            name: ${item.name}
        </h1>
        </div>
        `).join('');

        //Insetir o html na div especifica
        containerCharacterName.innerHTML = html;
    } else {
        containerCharacterName.innerHTML = `<p>Data não recebida</p>`
    }
}

//usando a função 

getAPi(api).then(data => {
    displayApiData(data)
});

