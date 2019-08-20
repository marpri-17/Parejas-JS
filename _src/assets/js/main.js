'use strict';

const gameBtn = document.querySelector('.game__btn');
const gameDifficulty = document.querySelector ('.game__difficulty-option') ;
const  cardsList= document.querySelector('.card__list');
const gameSuccess = document.querySelector('.game__win');

let cardsResults = [];
let userSelected = [];

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
    selectedCard.style.animation = "flippedCard 1s ease 1 forwards";
    selectedCard.nextSibling.style.animation = "flippedCard 1.2s ease 0.5s reverse 1 forwards";
    blockCard.classList.add('js-blocked');
    blockCard.classList.add('js-workcard');
    blockCard.removeEventListener('click', showPoke);
    //blockCard.addEventListener('click', hiddenCard);
    getPair(blockCard);
    checkUserFavorites();
    //If true clean user favorites
}
//let blockedCards = document.querySelectorAll('.js-blocked');

const hiddenCard = () =>{
    let pokeCards = document.querySelectorAll('.js-workcard')
    for( let i=0; i<pokeCards.length; i++){
    pokeCards[i].firstChild.style.animation = "";
    pokeCards[i].lastChild.style.animation = ""
    pokeCards[i].addEventListener('click', showPoke);
    }
    removeAnimationClass();
    removeWorkClass();
}

const removeWorkClass = () =>{
    let cards = document.querySelectorAll('.js-defaultcard');
    for (let i=0;i<cards.length;i++){
        cards[i].classList.remove('js-workcard');
    }
}
const removeAnimationClass = () =>{
    let cards = document.querySelectorAll('.js-defaultcard');
    for (let i=0;i<cards.length;i++){
        if (cards[i].classList.contains('js-workcard')){
            cards[i].classList.remove('js-blocked');
        }
    }
}

const checkSucces = () =>{
    let pokeCards = document.querySelectorAll('.js-blocked');
    if (pokeCards.length === parseInt(gameDifficulty.value)){
        gameSuccess.classList.add('active');
        console.log("Has ganado");
    }
}

const addWinClass = () =>{
    let hintCard = document.querySelectorAll('.js-blocked');
    for (let hint of hintCard){
        hint.classList.add('correct');
        hint.classList.remove('js-workcard');
    }
}

let checkUserFavorites = () =>{
    let check = checkLenght(userSelected);
    if (check === true){
       let partialUserData = userSelected.splice(1);
        if (partialUserData[0] === userSelected[0]){
            userSelected = [];
            addWinClass();
            checkSucces();
            console.log("Pareja. Pintar clases")
        } else {
            userSelected= [];
            window.setTimeout(hiddenCard(), 10000);
            //Remove classes
            //let pokeCards = document.querySelectorAll('.js-defaultcard');
            //pokeCards.classList.remove('.js-blocked')
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
const paintList = () =>{
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