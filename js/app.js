const symbols = [
    {name: 'puck', img: 'images/puck.jpg', pts: 1, penalty: false, puck: true, jackpot: false},
    {name: 'stick', img: 'images/stick.jpg', pts: 2, penalty: false, puck: false, jackpot: false},
    {name: 'helmut', img: 'images/helmut.jpg', pts: 3, penalty: false, puck: false, jackpot: false},
    {name: 'jersey', img: 'images/jersey.jpg', pts: 4, penalty: false, puck: false, jackpot: false},
    {name: 'stanleyCup', img: 'images/stanley-cup.jpg', pts: 20, penalty: false, puck: false, jackpot: true},
    {name: 'box', img: 'images/box.jpg', pts: -3, penalty: true, puck: false, jackpot:false},
    {name: 'powerPlay', img: 'images/power.jpg', pts: 3, penalty: false, puck: false, jackpot:false, powerplay:true}
]; 

const weighting = [6,6,5,4,4,3,3,3,3,2,2,2,2,2,,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,
                    0,0]; 

let reels, bankroll, bet, winnings;

let slotSounds = [new Audio('game-sounds/btnPush.mp3'), new Audio('game-sounds/landing-symbol-sound2.mp3'), 
                    new Audio('game-sounds/noMatch.mp3'), new Audio('game-sounds/reels-spinning2.mp3'),
                    new Audio('game-sounds/match1.mp3'), new Audio('game-sounds/match2.mp3'), 
                    new Audio('game-sounds/match3.mp3'), new Audio('game-sounds/match4.mp3'),
                    new Audio('game-sounds/match5.mp3'), new Audio('game-sounds/match6.mp3'),
                    new Audio('game-sounds/landing-symbol-sound.mp3'), new Audio('game-sounds/reel-spinning.mp3'), 
                    new Audio('game-sounds/reels-spinning.mp3')]; 

let capsSounds = [new Audio('game-sounds/arena-ambience.mp3'), new Audio('game-sounds/crowd-cheer.mp3'),
                    new Audio('game-sounds/hatrick.mp3'), new Audio('game-sounds/goal1.mp3'), 
                    new Audio('game-sounds/jackpot-celeration.mp3'), new Audio('game-sounds/penalty-box.mp3'),
                    new Audio('game-sounds/score3.mp3'), new Audio('game-sounds/scores.mp3')]


let hatrickSounds = [new Audio('game-sounds/hatrick.mp3'), new Audio('game-sounds/hatrick2.mp3'), 
                        new Audio('game-sounds/hatrick3.mp3'), new Audio('game-sounds/goal1.mp3'), 
                        new Audio('game-sounds/hatrick4.mp3')]; 

let twoRowSounds = [new Audio('game-sounds/power1.mp3'), new Audio('game-sounds/twoGoal2.mp3'), 
                        new Audio('game-sounds/twoGoal3.mp3'), new Audio('game-sounds/twoGoal4.mp3'), 
                        new Audio('game-sounds/twoGoal5.mp3')]; 

const reelEls = document.querySelectorAll('#reels div');
const spinBtn = document.getElementById('spin-btn');
const betEl = document.getElementById('bet-amt');
let refreshGameBtn = document.getElementById('refresh-btn');

refreshGameBtn.addEventListener('click', startOver);

function startOver(){
    document.location.reload()
};

spinBtn.addEventListener('click', function(evt){
    if (evt.target.tagName !== 'BUTTON') return;
    slotSounds[4].play(); 
    slotSounds[12].play();  
    spin(); 
});

document.getElementById('bet-btns').addEventListener('click', function(evt){
    if (evt.target.tagName !== 'BUTTON') return;
    bet = parseInt(evt.target.textContent);
    slotSounds[0].play(); 
    render();
})

function init() {
    bankroll = 200;
    winnings = 0;
    bet = 0;
    reels = [null, null, null];
    document.getElementById('msg').innerHTML = `Prize : ${winnings}`;
    document.getElementById('msg2').innerHTML = `Credits : ${bankroll}`;
    render();
};

init(); 

function doFlashing(callback) {
    // randomly choose symbols
    for (let i = 0; i < 3; i++) {
        reels.push(weighting[Math.floor(Math.random() * weighting.length)]); 
    }
    // start eye candy flashing
    let count = 0;
    let stoppedReels = 0;
    let timerId = setInterval(function(){
        for (let i = 2; i >= stoppedReels; i--) {
            let rndSym = symbols[Math.floor(Math.random() * symbols.length)];
            reelEls[i].style.backgroundImage = `url(${rndSym.img})`;
        }
        if (count === 30) {
            stoppedReels++;
            reelEls[0].style.backgroundImage = `url(${symbols[reels[0]].img})`;
            slotSounds[10].play(); 
        } else if (count === 40) {
            stoppedReels++;
            reelEls[1].style.backgroundImage = `url(${symbols[reels[1]].img})`;
            slotSounds[1].play(); 
        } else if (count === 50) {
            reelEls[2].style.backgroundImage = `url(${symbols[reels[2]].img})`;
            slotSounds[10].play(); 
            clearInterval(timerId);
            callback(); 
        }
        count++;
    }, 100); 
}; 

function spin() {
    reels = [];
    winnings = 0;
    doFlashing(function() {
        computeWinnings();
        bet = 0;
        render();
    });
}; 

function randomHat() {
    let randomHatrick = hatrickSounds[Math.floor(Math.random() * hatrickSounds.length)]; 
    randomHatrick.play(); 
};

function randomTwo() {
    let randomTwoRow = twoRowSounds[Math.floor(Math.random() * twoRowSounds.length)]; 
    randomTwoRow.play(); 
}

function getNumPenalties() {
    let count = 0; 
    reels.forEach(reel => {
        // find the actual symbol object for the reel (idx)
        let symbol = symbols[reel];
        if (symbol.penalty) count++; 
    });
    return count; 
}; 

function getJackpot() {
    let count = 0; 
    reels.forEach(reel => {
        let symbol = symbols[reel]; 
        if (symbol.jackpot) count++; 
    }); 
    return count; 
}; 

function numPowerplay() {
    let count = 0;
    reels.forEach(reel => {
        let symbol = symbols[reel]; 
        if (symbol.powerplay) count++; 
    })
    return count; 
};

function threeOfAKind() {
    for (let i = 0; i < symbols.length; i++) {
        let total = reels.reduce((acc, reel) => reel === i ? acc + 1 : acc, 0); 
        if (total >= 3) return symbols[i]; 
    } 
    return null; 
}

function twoOfAKind() {
    for (let i = 0; i < symbols.length; i++) {
        let total = reels.reduce((acc, reel) => reel === i ? acc + 1 : acc, 0); 
        if (total >= 2) return symbols[i]; 
    } 
    return null; 
}

function render() {
    let jackpot = symbols.find(sym => sym.jackpot);
    for (let i = 0; i < 3; i++) {
        if (reels[i] === null) {
            reelEls[i].style.backgroundImage = `url(${jackpot.img})`;
        } else {
            reelEls[i].style.backgroundImage = `url(${symbols[reels[i]].img})`;
        }
    }
    document.getElementById('msg').innerHTML = `Prize : ${winnings}`;
    document.getElementById('msg2').innerHTML = `Credits : ${bankroll}`;
    if (bankroll <= 0) {
        document.getElementById('loseMsg').innerHTML = "You don't have enough credits!";
        document.getElementById("spin-btn").disabled = true; 
        document.getElementById("double-bet").disabled = true; 
        document.getElementById('msg2').innerHTML = "Credits : 0";
    }
    betEl.textContent = bet;
    spinBtn.style.visibility = bet ? 'visible' : 'hidden';
};

function computeWinnings() {
    winnings = 0;
    let penalties = getNumPenalties();
    let jackpot = getJackpot(); 
    let symbolThree = threeOfAKind(); 
    let symbolTwo = twoOfAKind(); 
    let newPowerPlay = numPowerplay(); 
    if (penalties) {
        let penaltySymbol = symbols.find(symbol => symbol.penalty); 
        capsSounds[5].play(); 
        winnings = penaltySymbol.pts * bet;
    } else if (jackpot === 3) {
        let jackPotSymbol = symbols.find(symbol => symbol.jackpot); 
        capsSounds[4].play(); 
        winnings = jackPotSymbol.pts * 20; 
    } else if (symbolThree) {
        randomHat();  
        winnings += symbolThree.pts * 3 * bet; 
    } else if (symbolTwo) {
        randomTwo(); 
        if (symbolTwo.puck) {
            winnings = 0;
        } else { 
            winnings = symbolTwo.pts * bet; 
            if (newPowerPlay) winnings *= 2; 
        }
    } else {
        winnings = -1 * bet;
    }
    bankroll += winnings;
}; 
 



// || reels[1] === reels[2] || reels[0] === reels[2])
//    let symbol = symbols[reels[0]];
//         let symbol2 = symbols[reels[1]]; 
//         let symbol3 = symbols[reels[2]];


// else if (reels[0] === reels[1] && reels[2] === symbols[4].id) {
//     winnings += symbols[reels[0]].pts + symbols[reels[1]].pts + symbols[4].pts;
//     bankroll += winnings; 
// } else if (reels[0] === reels[2] && reels[1] === symbols[4].id) {
//     winnings += symbols[reels[0]].pts + symbols[reels[2]].pts + symbols[4].pts;
//     bankroll += winnings; 
// } else if (reels[1] === reels[2] && reels[0] === symbols[4].id) {
//     winnings += symbols[reels[1]].pts + symbols[reels[2]].pts + symbols[4].pts;
//     bankroll += winnings; 
// } 


// else if (reels[0] === reels[1] && reels[1] === reels[2]) {
//     winnings += symbols[reels[0]].pts + symbols[reels[1]].pts + symbols[reels[2]].pts;
//     winnings *= 2; 
//     bankroll += winnings; 
// } else if(reels[0] === reels[1]) { 
//     winnings += symbols[reels[0]].pts + symbols[reels[1]].pts;
//     bankroll += winnings; 
// } else if (reels[1] === reels[2]) {
//     winnings += symbols[reels[1]].pts + symbols[reels[2]].pts;
//     bankroll += winnings; 
// } else if (reels[0] === reels[2]) {
//     winnings += symbols[reels[0]].pts + symbols[reels[2]].pts;
//     bankroll += winnings; 