const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const dealerCards = document.getElementById("dealerCards");
const playerCards = document.getElementById("playerCards");
const playerTotalEl = document.getElementById("playerTotal");
const dealerTotalEl = document.getElementById("dealerTotal");
const trainingPointsEl = document.getElementById("trainingPoints");
const recommendedActionEl = document.getElementById("recommendedAction");
const trainingReasonEl = document.getElementById("trainingReason");
const trainingResultEl = document.getElementById("trainingResult");
const statusMessage = document.getElementById("statusMessage");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const newRoundButton = document.getElementById("newRound");
const testButton = document.getElementById("testStrategy");

let deck = [];
let playerHand = [];
let dealerHand = [];
let roundOver = true;
let trainingPoints = 0;

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

function scoreDetails(hand) {
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

  const soft = aces > 0;
  return { total, soft };
}

function calculateScore(hand) {
  return scoreDetails(hand).total;
}

function handLabel(hand) {
  const { total, soft } = scoreDetails(hand);
  if (!hand.length) return "";
  return `${soft ? "Soft" : "Hard"} ${total}`;
}

function formatAction(action) {
  return action === "hit" ? "Hit" : "Stand";
}

function recommendedAction(hand, dealerUpCard) {
  if (!dealerUpCard || hand.length === 0) {
    return null;
  }

  const dealerValue = cardValue(dealerUpCard);
  const { total, soft } = scoreDetails(hand);

  if (soft) {
    if (total <= 17) {
      return {
        action: "hit",
        reason: `${handLabel(hand)} is protected by an ace. Keep hitting until you reach at least 18.`,
      };
    }

    if (total === 18) {
      if (dealerValue >= 9 || dealerUpCard.value === "A") {
        return {
          action: "hit",
          reason: "Soft 18 often loses to strong dealer upcards. Hit to improve while the ace prevents a bust.",
        };
      }

      return {
        action: "stand",
        reason: "Soft 18 against a weak or medium dealer upcard is already competitive. Stand and make the dealer work.",
      };
    }

    return {
      action: "stand",
      reason: `${handLabel(hand)} (soft 19 or better) should stand because you're already ahead of most dealer outcomes.`,
    };
  }

  if (total <= 11) {
    return {
      action: "hit",
      reason: `${handLabel(hand)} cannot bust with one more card. Hit to build toward 21.`,
    };
  }

  if (total === 12) {
    if (dealerValue >= 4 && dealerValue <= 6) {
      return {
        action: "stand",
        reason: "Hard 12 versus a dealer 4-6 stands. The dealer is likely to bust, so let them draw first.",
      };
    }

    return {
      action: "hit",
      reason: "Hard 12 against strong dealer cards should hit; standing often loses to 7, 8, 9, 10, or ace upcards.",
    };
  }

  if (total >= 13 && total <= 16) {
    if (dealerValue >= 2 && dealerValue <= 6) {
      return {
        action: "stand",
        reason: `${handLabel(hand)} stands versus dealer 2-6 because the dealer is prone to busting while you risk busting if you hit.`,
      };
    }

    return {
      action: "hit",
      reason: `${handLabel(hand)} should hit against dealer 7 or higher to avoid losing to a likely strong dealer total.`,
    };
  }

  return {
    action: "stand",
    reason: `${handLabel(hand)} stands. At 17 or better you beat most dealer totals and risk busting if you hit.`,
  };
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
  recommendedActionEl.textContent = "Round finished. Start a new round to keep training.";
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
  trainingResultEl.textContent = "Choose Hit or Stand to earn points.";
  setRecommendation();
  checkForBlackjack();
}

function updatePointsDisplay() {
  trainingPointsEl.textContent = trainingPoints;
}

function setRecommendation() {
  const suggestion = recommendedAction(playerHand, dealerHand[0]);
  if (!suggestion) {
    recommendedActionEl.textContent = "Start a round to see coaching tips.";
    return;
  }

  const dealerLabel = dealerHand.length ? dealerHand[0].value : "?";
  recommendedActionEl.textContent = `${formatAction(suggestion.action)} ${handLabel(playerHand)} versus dealer ${dealerLabel}.`;
  trainingReasonEl.textContent = suggestion.reason;
}

function recordChoice(action, suggestion) {
  if (!suggestion) return;

  const isCorrect = suggestion.action === action;
  if (isCorrect) {
    trainingPoints += 10;
    trainingResultEl.textContent = `You chose ${formatAction(action)} — correct! (+10 points)`;
  } else {
    trainingResultEl.textContent = `You chose ${formatAction(action)}. Basic strategy prefers ${formatAction(
      suggestion.action
    )}. No points awarded.`;
  }

  trainingReasonEl.textContent = suggestion.reason;
  updatePointsDisplay();
}

function hit() {
  if (roundOver) return;

  const suggestion = recommendedAction(playerHand, dealerHand[0]);
  recordChoice("hit", suggestion);
  playerHand.push(deck.pop());
  const score = calculateScore(playerHand);
  updateDisplay({ revealDealer: false });

  if (score > 21) {
    endRound("Bust! Dealer wins.");
  } else {
    setRecommendation();
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
  const suggestion = recommendedAction(playerHand, dealerHand[0]);
  recordChoice("stand", suggestion);
  dealerTurn();
  determineOutcome();
}

function simulateSingleRound() {
  const simDeck = shuffleDeck(buildDeck());
  const simPlayer = [simDeck.pop(), simDeck.pop()];
  const simDealer = [simDeck.pop(), simDeck.pop()];

  const playerBlackjack = calculateScore(simPlayer) === 21 && simPlayer.length === 2;
  const dealerBlackjack = calculateScore(simDealer) === 21 && simDealer.length === 2;

  if (playerBlackjack && dealerBlackjack) return "push";
  if (playerBlackjack) return "win";
  if (dealerBlackjack) return "loss";

  let suggestion = recommendedAction(simPlayer, simDealer[0]);

  while (suggestion) {
    if (suggestion.action === "hit") {
      simPlayer.push(simDeck.pop());
      if (calculateScore(simPlayer) > 21) return "loss";
      suggestion = recommendedAction(simPlayer, simDealer[0]);
      continue;
    }

    while (calculateScore(simDealer) < 17) {
      simDealer.push(simDeck.pop());
    }

    const playerScore = calculateScore(simPlayer);
    const dealerScore = calculateScore(simDealer);

    if (dealerScore > 21) return "win";
    if (playerScore > dealerScore) return "win";
    if (playerScore < dealerScore) return "loss";
    return "push";
  }

  return "push";
}

function runStrategyTest(rounds = 1000) {
  let wins = 0;
  for (let i = 0; i < rounds; i += 1) {
    const outcome = simulateSingleRound();
    if (outcome === "win") wins += 1;
  }

  return ((wins / rounds) * 100).toFixed(1);
}

function handleTestClick() {
  testButton.disabled = true;
  statusMessage.textContent = "Running 1000 strategy rounds...";

  requestAnimationFrame(() => {
    const winRate = runStrategyTest();
    statusMessage.textContent = `Strategy test complete: ${winRate}% player win rate over 1000 rounds.`;
    trainingResultEl.textContent = `Strategy autoplay win rate: ${winRate}% over 1000 rounds.`;
    testButton.disabled = false;
  });
}

newRoundButton.addEventListener("click", startRound);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
testButton.addEventListener("click", handleTestClick);

// Start with a ready state
updateDisplay({ revealDealer: false });
updatePointsDisplay();
