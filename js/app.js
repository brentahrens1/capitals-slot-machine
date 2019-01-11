let reels, bankroll, bet, winnings;

const reelEls = document.querySelectorAll('#reels div');
const spinBtn = document.getElementById('spin-btn');
const betEl = document.getElementById('bet-amt');
const refreshGameBtn = document.getElementById('refresh-btn');
const oviSlide = document.getElementById('ovi');
const oshieSlide = document.getElementById('oshie'); 
const tomFight = document.getElementById('tom');
const placeBetMsg = document.querySelector('h3'); 

const symbols = [
    {name: 'logo', img: 'images/mascot2.jpg', pts: 1, penalty: false, puck: true, jackpot: false},
    {name: 'mascot', img: 'images/holtsss.png', pts: 2, penalty: false, puck: false, jackpot: false},
    {name: 'ovechkin', img: 'images/conn.png', pts: 8, penalty: false, puck: false, jackpot: false},
    {name: 'conn-symthe', img: 'images/ovechkin.png', pts: 4, penalty: false, puck: false, jackpot: false},
    {name: 'stanley-cup', img: 'images/cup1.png', pts: 20, penalty: false, puck: false, jackpot: true},
    {name: 'box', img: 'images/Ref.png', pts: -3, penalty: true, puck: false, jackpot:false},
    {name: 'power-play', img: 'images/backstrom.png', pts: 3, penalty: false, puck: false, jackpot:false, powerplay:true}
]; 

const weighting = [6,6,6,6,6,5,5,4,4,4,3,3,3,3,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]; 

let slotSounds = [new Audio('game-sounds/btnPush.mp3'), new Audio('game-sounds/landing-symbol-sound2.mp3'), 
                    new Audio('game-sounds/match1.mp3'), new Audio('game-sounds/match6.mp3'), 
                    new Audio('game-sounds/landing-symbol-sound.mp3'), new Audio('game-sounds/reels-spinning.mp3'), 
                    new Audio('game-sounds/crowd-cheer.mp3'),]; 

let capsSounds = [new Audio('game-sounds/jackpot-celeration.mp3'), new Audio('game-sounds/penalty-box.mp3')]; 


let hatrickSounds = [new Audio('game-sounds/hatrick.mp3'), new Audio('game-sounds/hatrick2.mp3'), 
                        new Audio('game-sounds/hatrick3.mp3'), new Audio('game-sounds/goal1.mp3'), 
                        new Audio('game-sounds/hatrick4.mp3')]; 

let twoRowSounds = [new Audio('game-sounds/power1.mp3'), new Audio('game-sounds/twoGoal2.mp3'), 
                        new Audio('game-sounds/twoGoal3.mp3'), new Audio('game-sounds/twoGoal4.mp3'), 
                        new Audio('game-sounds/twoGoal5.mp3')]; 

let missSounds = [new Audio('game-sounds/miss1.mp3'), new Audio('game-sounds/miss2.mp3'), 
                    new Audio('game-sounds/miss3.mp3'), new Audio('game-sounds/miss4.mp3')]


spinBtn.addEventListener('click', function(evt){
    if (evt.target.tagName !== 'BUTTON') return;
    slotSounds[2].play(); 
    slotSounds[5].play();  
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
            slotSounds[4].play(); 
        } else if (count === 40) {
            stoppedReels++;
            reelEls[1].style.backgroundImage = `url(${symbols[reels[1]].img})`;
            slotSounds[1].play(); 
        } else if (count === 50) {
            reelEls[2].style.backgroundImage = `url(${symbols[reels[2]].img})`;
            slotSounds[4].play(); 
            clearInterval(timerId);
            callback(); 
        }
        count++;
    }, 100); 
}; 

function spin() {
    winnings = null;
    reels = [];
    for (let i = 0; i < 3; i++) {
        reels.push(weighting[Math.floor(Math.random() * weighting.length)]); 
    }
    spinBtn.style.visibility = 'hidden';
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

function randomMiss() {
    let randomMisses = missSounds[Math.floor(Math.random() * missSounds.length)]; 
    randomMisses.play(); 
}

function getNumPenalties() {
    let count = 0; 
    reels.forEach(reel => {
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
    document.getElementById('msg').innerHTML = winnings;
    document.getElementById('msg2').innerHTML = bankroll;
    if (bankroll <= 0) {
        document.getElementById('loseMsg').innerHTML = "You don't have enough credits!";
        document.getElementById("spin-btn").disabled = true; 
        document.getElementById("double-bet").disabled = true; 
        document.getElementById('msg2').innerHTML = "0";
    }
    betEl.textContent = bet;
    placeBetMsg.style.visibility = bet ? 'hidden' : 'visible';
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
        tomFight.className = 'tom';
        setTimeout(function() {
            tomFight.className = "hidden"; 
        }, 2500) 
        capsSounds[1].play(); 
        winnings = penaltySymbol.pts * bet;
    } else if (jackpot === 3) {
        let jackPotSymbol = symbols.find(symbol => symbol.jackpot);  
        oviSlide.className = 'ovi';
        setTimeout(function() {
            oviSlide.className = "hidden"; 
        }, 2000) 
        capsSounds[0].play(); 
        winnings = jackPotSymbol.pts * 50; 
    } else if (symbolThree) {
        oviSlide.className = 'ovi';
        setTimeout(function() {
            oviSlide.className = "hidden"; 
        }, 2000) 
        randomHat(); 
        slotSounds[6].play(); 
        winnings += symbolThree.pts * 3 * bet; 
    } else if (symbolTwo) {
        oshieSlide.className = "oshie";
        setTimeout(function() {
            oshieSlide.className = "hidden"; 
        }, 2000)
        randomTwo(); 
        if (symbolTwo.puck) {
            winnings = 1;
        } else { 
            winnings = symbolTwo.pts * bet; 
            if (newPowerPlay) winnings *= 2; 
        }
    } else {
        randomMiss(); 
        winnings = -1 * bet;
    }
    bankroll += winnings;
}; 
 