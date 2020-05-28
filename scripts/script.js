// ISSD with FUT Cards


// Master
class ISSD {
    constructor(){
        this._setupPlayers();
        this._setupHTMLElements();
        this._setupScore();
        this.clickCounter = 1;
        this.preventClick = false;
        
    }


// Game methods

    _setupPlayers(){
        this.players = players;
        this.openCards = [];
    }


    _setupHTMLElements(){
        this.el = {};
        this.el.cards = $('.card');
        this.el.goals = $('#goals');
        this.el.shots = $('#shots');
        

    }

    _setupScore(){
        this.score = {};
        this.score.shotsMissed = 0;
        this.score.goal = 0;
        this.score.reachLimit = this.el.cards.length / 2;
    }

// click events
    clickMatchBall(el){
        kickBall[0].play();
        if(this.preventClick || el.hasClass('open')){
            return;
        }
        

        el.addClass('open');

        this.openCards.push(el);

        if(this.clickCounter == 2){
            this.clickCounter = 1;
            this.preventClick = true;
      
        const scoreGoal = this._playerMatch(this.openCards[0], this.openCards[1]);
            if(scoreGoal){
                this._updateGoalsScored();
                goalScore[0].play();
                   
                if(this.score.goal == this.score.reachLimit){
                    this._finalWhistleWin();
                    return;
                    
                }
  
            }else{
                this._updateShotsMissed();
                if(this.score.shotsMissed == this.score.reachLimit){
                    this._finalWhistleLose();
                    return;
                }
                
            }
        
        this.openCards = [];
        return;
    
    }
    this.clickCounter++;
}


// initilization
    init(){
        this._startingLineup(this.players, this.el.cards);
    }


// shuffle players    
    _startingLineup(arr, el){
    const players = this._shuffle(arr);

    this.el.cards.each(function(i){
        $(this).data('number', players[i].number);

        const $img = $('<img>');
        $img.attr({
            src: players[i].imgLoc,
            name: players[i].name

        });

        $(this).children('.card-image').append($img);

    });

    }

// turn updates

    _playerMatch(p1, p2){
        if(p1.data('number') == p2.data('number')){
            this.preventClick = false;
            p1.addClass('matched');
            p2.addClass('matched');
            return true;
            
        }

        setTimeout(() => {
            p1.removeClass('open');
            p2.removeClass('open');
            p1.one('transitionend', () => { this.preventClick = false });
        }, 800);
        return false;
    }

// counters

    _updateShotsMissed(){

        this.score.shotsMissed++;

        this.el.shots.text(() => {
            if(this.score.shotsMissed < 6) {
                return `0${this.score.shotsMissed}`;
            }else{
                return this.score.shotsMissed;
            }

        });
    }

    _updateGoalsScored(){
        this.score.goal++;

        this.el.goals.text(() => {
            if(this.score.goal < 7 ) {
                return `0${this.score.goal}`;

            }else{
                return this.score.goal;
                
            }
            
        });

        
    }

// end game popups

    _finalWhistleWin(){
        this.preventClick = true;
          
        playMusic.pause();
        playMusic.currentTime = 0;
                youWin[0].play();
                setTimeout(function(){
                    
                    winpop.addClass('show')
                    }, 1300); 

    }

    _finalWhistleLose(){
        this.preventClick = true;
        
        playMusic.pause();
        playMusic.currentTime = 0;
                youLose[0].play();
                setTimeout(function(){
                    
                    losepop.addClass('show')
                }, 1300);
    };



// Shuffle array
    _shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

}

// Audio
const kickBall = $('#kick-ball');
const goalScore = $('#goal-match');

const playMusic = new Howl({
    src: ['audio/play-music.mp3'],
    //autoplay: false,
    loop: true
});

const youLose = $('#you-lose');
const youWin = $('#you-win');
const referee = $('#referee-start');
const intro = $('#intro');
// audio end


const winpop = $('.pop-up-window-win')
const losepop = $('.pop-up-window-lose')


const match = new ISSD();

match.init();


// intro sound
$(document).ready(intro[0].play());

// go to game page
$('#btn-press-start').click(function(e){
    e.preventDefault();
    referee[0].play();
    $('body').addClass('show-game-screen');
    playMusic.play();
});

// card click
$('.card').click(function(){
    match.clickMatchBall( $(this) );
});


// no sound on matched players
$('.card-image').click(function(){
    kickBall.prop('muted', true);
});

// end game click
$('#btn-end-game').click(function(){
    playMusic.stop();
    losepop.addClass('show')
    youLose[0].play();
});

// yes and no click buttons 
$('.btn-no').click(function(){
    playMusic.stop();
    losepop.removeClass('show');
    winpop.removeClass('show');
    $('.card').off('click');
    
    });


$('.btn-yes').click(function(){
    document.location.reload(true);
});