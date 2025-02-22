
const categories = {
    fruits: ['🍎', '🍌', '🍓', '🍇', '🍊', '🍉', '🍍', '🥝'],
    emojis: ['😀', '😂', '😎', '😜', '🤩', '🥳', '😭', '😍'],
    animals: ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐸', '🐷'],
    planets: ['🌍', '🌕', '🪐', '☀️', '⭐', '🌟', '🌌', '🌑']
};
let score = 0;
let timeLeft = 45;
let timer;
let selectedCategory = [];
let selectedCards = [];
let matchedCards = 0;

function startGame(category) {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    selectedCategory = [...categories[category], ...categories[category]];
    selectedCategory.sort(() => Math.random() - 0.5);
    generateGrid();
    startTimer();
}

function generateGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    selectedCategory.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'hidden-card');
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.addEventListener('click', handleCardClick);
        grid.appendChild(card);
    });
}

function handleCardClick(event) {
    const card = event.target;
    if (selectedCards.length < 2 && !card.classList.contains('revealed')) {
        card.textContent = card.dataset.symbol;
        card.classList.add('revealed');
        card.classList.remove('hidden-card');
        selectedCards.push(card);
    }
    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    if (selectedCards[0].dataset.symbol === selectedCards[1].dataset.symbol) {
        selectedCards.forEach(card => card.style.backgroundColor = 'green');
        matchedCards++;
        score += 10;
        document.getElementById('score').textContent = score;
        if (matchedCards === selectedCategory.length / 2) {
            alert('You Win!');
            clearInterval(timer);
        }
    } else {
        selectedCards.forEach(card => {
            card.textContent = '';
            card.classList.remove('revealed');
            card.classList.add('hidden-card');
        });
    }
    selectedCards = [];
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
        } else {
            clearInterval(timer);
            alert('Game Over!');
        }
    }, 1000);
}

function restartGame() {
    clearInterval(timer);
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('score').textContent = '0';
    document.getElementById('timer').textContent = '45';
    score = 0;
    timeLeft = 45;
    matchedCards = 0;
    selectedCards = [];
}
