//https://hp-api.herokuapp.com/
//https://hp-api.herokuapp.com/api/characters
const containerImagem = document.querySelector(".card-container-character");

const characterList = fetch("https://hp-api.herokuapp.com/api/characters")
.then(res => res.json())
.then((imagens) => 
    imagens.forEach((imagem => {
        containerImagem.innerHTML += `
        <li>
              <img src="${imagem.image}"
                    alt="Imagem dos Personagens">
        </li>  
   ` })
));



//<iframe src="" title="" frameborder="0" allowfullscreen></iframe>
