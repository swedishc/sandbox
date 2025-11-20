const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const dealerCards = document.getElementById("dealerCards");
const playerCards = document.getElementById("playerCards");
const playerTotalEl = document.getElementById("playerTotal");
const dealerTotalEl = document.getElementById("dealerTotal");
const statusMessage = document.getElementById("statusMessage");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const newRoundButton = document.getElementById("newRound");

let deck = [];
let playerHand = [];
let dealerHand = [];
let roundOver = true;

function buildDeck() {
  const freshDeck = [];
  for (const suit of suits) {
    for (const value of values) {
      freshDeck.push({ suit, value });
    }
  }
  return freshDeck;
}

function shuffleDeck(cards) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function cardValue(card) {
  if (card.value === "A") return 11;
  if (["K", "Q", "J"].includes(card.value)) return 10;
  return Number(card.value);
}

function calculateScore(hand) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    total += cardValue(card);
    if (card.value === "A") aces += 1;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function renderHand(target, hand) {
  target.innerHTML = "";
  hand.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";

    const value = document.createElement("div");
    value.className = "value";
    value.textContent = card.value;

    const suit = document.createElement("div");
    suit.className = "suit";
    suit.textContent = card.suit;

    cardEl.appendChild(value);
    cardEl.appendChild(suit);
    target.appendChild(cardEl);
  });
}

function updateDisplay({ revealDealer = true } = {}) {
  renderHand(playerCards, playerHand);

  const dealerHasCards = dealerHand.length > 0;
  const playerScore = playerHand.length > 0 ? calculateScore(playerHand) : 0;
  let dealerScore = 0;

  if (revealDealer || !dealerHasCards) {
    renderHand(dealerCards, dealerHand);
    dealerScore = dealerHasCards ? calculateScore(dealerHand) : 0;
  } else {
    renderHand(dealerCards, dealerHand.slice(0, 1));
    dealerScore = cardValue(dealerHand[0]);
  }

  playerTotalEl.textContent = playerScore;
  dealerTotalEl.textContent = dealerScore;
}

function endRound(message) {
  roundOver = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  statusMessage.textContent = message;
  updateDisplay({ revealDealer: true });
}

function checkForBlackjack() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  const playerBlackjack = playerScore === 21 && playerHand.length === 2;
  const dealerBlackjack = dealerScore === 21 && dealerHand.length === 2;

  if (playerBlackjack && dealerBlackjack) {
    endRound("Push! Both have blackjack.");
    return true;
  }

  if (playerBlackjack) {
    endRound("Blackjack! You win.");
    return true;
  }

  if (dealerBlackjack) {
    endRound("Dealer has blackjack. You lose.");
    return true;
  }

  return false;
}

function dealInitialHands() {
  deck = shuffleDeck(buildDeck());
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
}

function startRound() {
  dealInitialHands();
  roundOver = false;
  hitButton.disabled = false;
  standButton.disabled = false;
  statusMessage.textContent = "Your move: hit or stand.";
  updateDisplay({ revealDealer: false });
  checkForBlackjack();
}

function hit() {
  if (roundOver) return;

  playerHand.push(deck.pop());
  const score = calculateScore(playerHand);
  updateDisplay({ revealDealer: false });

  if (score > 21) {
    endRound("Bust! Dealer wins.");
  }
}

function dealerTurn() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
}

function determineOutcome() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21) {
    endRound("Dealer busts! You win.");
    return;
  }

  if (playerScore > dealerScore) {
    endRound("You win the round!");
  } else if (playerScore < dealerScore) {
    endRound("Dealer wins the round.");
  } else {
    endRound("Push. It's a tie.");
  }
}

function stand() {
  if (roundOver) return;
  dealerTurn();
  determineOutcome();
}

newRoundButton.addEventListener("click", startRound);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

// Start with a ready state
updateDisplay({ revealDealer: false });
