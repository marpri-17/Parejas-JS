'use strict';

const gameBtn = document.querySelector('.game__btn');
const gameDifficulty = document.querySelector ('.game__difficulty-option') ;
const  cardsList= document.querySelector('.card__list');
const gameSuccess = document.querySelector('.game__win');

let cardsResults = [];
let userSelected = [];
let success = 0;

const checkLenght = (arr) =>{
  return arr.length === 2;
}

const readUserDifficulty = () =>{
    if(gameDifficulty.value){
        let userDifficulty = parseInt(gameDifficulty.value);
        return userDifficulty;
    } return userDifficulty = 4;

}

const getDatafromAPI = ()=> {
    let difficulty = readUserDifficulty();
    fetch (`https://raw.githubusercontent.com/Adalab/cards-data/master/${difficulty}.json`)
    .then(Response=>Response.json())
    .then(data => {
        cardsResults = data;
        paintList();
    })
    .catch(error => console.log(error))
}

const showPoke = (ev) => {
    const selectedCard = ev.target;
    let blockCard = selectedCard.parentElement;
    selectedCard.style.animation = "flippedCard 2s ease 1 forwards";
    selectedCard.nextSibling.style.animation = "flippedCard 2s ease 1.3s reverse 1 forwards";
    blockCard.removeEventListener('click', showPoke);
    //blockCard.addEventListener('click', hiddenCard);
    blockCard.classList.add('js-blocked');
    getPair(blockCard);
    checkUserFavorites();
    //If true clean user favorites
}

const hiddenCard = () =>{
    let blockedCards = document.querySelectorAll('.js-blocked');
    for (let item=0; item < blockedCards.length; item++){
        blockedCards[item].firstChild.style.animation = "flippedCard 2s ease 1.3s reverse 1 forwards";
        blockedCards[item].lastChild.style.animation = "flippedCard 2s ease 1 forwards";
        blockedCards[item].addEventListener('click', showPoke);
    };

}

const checkSucces = (counter) =>{
    if (counter === (parseInt(gameDifficulty.value))/2){
        gameSuccess.classList.add('active');
        console.log("Has ganado");
    }
}
let checkUserFavorites = () =>{
    let check = checkLenght(userSelected);
    if (check === true){
       let partialUserData = userSelected.splice(1);
        if (partialUserData[0] === userSelected[0]){
            userSelected = [];
            success++;
            checkSucces(success);
            console.log("Pareja. Pintar clases")
        } else {
            userSelected= [];
            setTimeout(hiddenCard, 3);
            console.log("No son pareja. Dar la vuelta tras 5 segundos");
        }
    }
}

const getPair = (element) =>{
    let indexDOM = parseInt(element.dataset.index);
    for (let i=0;i<cardsResults.length;i++){
        if (indexDOM === i){
            userSelected.push(cardsResults[i].pair);
        }
    }
    console.log(userSelected);
}

const addListeners = () =>{
    let cards = document.querySelectorAll('.js-defaultcard');
    for (let card of cards){
        card.addEventListener('click', showPoke);
    }
}
const setPokemon = () =>{
    let cards = document.querySelectorAll('.js-defaultcard-poke');
    for (let i=0; i<cards.length;i++){
        cards[i].style.backgroundImage = `url(${cardsResults[i].image})`;
    }
}

const paintList = () =>{
    const paintIt = () =>{
        for (let i=0; i<cardsResults.length;i++){
        const newCard = document.createElement('li');
        const newCardImageFront = document.createElement('img');
        const newCardImageBack = document.createElement('img');
        newCardImageFront.classList.add('js-defaultcard-img');
        newCardImageBack.classList.add('js-defaultcard-poke');
        newCard.classList.add('js-defaultcard');
        newCard.appendChild(newCardImageFront);
        newCard.appendChild(newCardImageBack);
        cardsList.appendChild(newCard);
        newCard.dataset.index = [i];
        }
    }
if (cardsList.children.length === 0){
    paintIt ()
    addListeners();
    setPokemon();
} else {
    cardsList.innerHTML = "";
    paintIt();
    addListeners();
    setPokemon();
}
}

const startGame = (ev) =>{
    ev.preventDefault();
    ev.stopPropagation();
    getDatafromAPI();
    //gameBtn.disabled=true;
};

gameBtn.addEventListener("click",startGame);