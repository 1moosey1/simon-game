import './game.scss';
import GamePiece from './GamePiece/GamePiece.jsx';
import Console from './GameConsole/GameConsole.jsx';

let audioLink = "https://s3.amazonaws.com/freecodecamp/";

module.exports = React.createClass({

    sounds: [], pattern: [],
    patternIndex: 0,

    getInitialState: function() {

        // When displaying a level's pattern, we use a listener
        // to indicate when a sound has ended and know to play the next
        let audioListener = function() {

            // Move to the next button to be displayed
            this.patternIndex++;

            if(this.state.forceGreen)
                this.setState({forceGreen: false});

            else if(this.state.forceRed)
                this.setState({forceRed: false});

            else if(this.state.forceYellow)
                this.setState({forceYellow: false});

            else if(this.state.forceBlue)
                this.setState({forceBlue: false});

            // Wait 350 milliseconds before displaying next button
            // Ensures the displayed pattern isn't shown too fast
            window.setTimeout(this.displayPattern, 350);

        }.bind(this);

        // Initialize sounds
        this.sounds = [
            new Audio(audioLink + "simonSound1.mp3"), // Green sound effect
            new Audio(audioLink + "simonSound2.mp3"), // Red sound effect
            new Audio(audioLink + "simonSound3.mp3"), // Yellow sound effect
            new Audio(audioLink + "simonSound4.mp3")  // Blue sound effect
        ];

        // Attach listener to each sound
        this.sounds.forEach((sound)=>{
            sound.addEventListener("ended", audioListener);
        });

        return {

            power: false, strict: false,
            forceGreen: false, forceRed: false,
            forceYellow: false, forceBlue: false,
            count: 0
        };
    },

    getPower: function()
        { return this.state.power; },

    getStrict: function()
        { return this.state.strict; },

    getCount: function()
        { return this.state.count; },

    togglePower: function() {

        if(this.state.power){

            this.setState({ power: false, strict: false, count: 0 });
        }
        else {

            this.resetGame();
            this.setState({ power: true, count: 1 }, this.startLevel);
        }
    },

    toggleStrict: function() {

        if(this.state.power)
            this.setState({ strict: !this.state.strict });
    },

    // Called when the game pieces are pressed
    onPress: function(evtObj) {

        // Only play sounds when power is on
        if(this.state.power) {

            let id = evtObj.target.id;
            this.sounds[id].pause();
            this.sounds[id].currentTime = 0;
            this.sounds[id].play();
        }
    },

    startLevel: function() {

        let pattern, count, randBtn;
        pattern = this.pattern;

        // Determine how many new random buttons need to be added to level's pattern
        count = this.getCount() - pattern.length;
        if (count < 0) {

            pattern = [];
            count = this.getCount();
        }

        // Generate and add the new buttons to pattern
        for(let i = 0; i < count; ++i) {

            randBtn = Math.floor(Math.random() * 4);
            pattern.push(randBtn);
        }

        this.displayPattern();
    },

    displayPattern: function () {

        // If we already displayed entire pattern return and display nothing
        if(this.patternIndex >= this.pattern.length)
            return;

        // Display next button in the pattern and play associated sound
        let btnValue = this.pattern[this.patternIndex];

        if(btnValue === 0)
            this.setState({forceGreen: true});

        else if(btnValue === 1)
            this.setState({forceRed: true});

        else if(btnValue === 2)
            this.setState({forceYellow: true});

        else if(btnValue === 3)
            this.setState({forceBlue: true});

        this.sounds[btnValue].play();
    },

    resetGame: function() {

        this.setState({ count: 1 });
        this.pattern = [];
        this.patternIndex = 0;
    },

    render: function() {

        return (
            <div className="bgc">

                <GamePiece className="green-btn" id="0"
                           onPress={this.onPress}
                           power={this.getPower}
                           forceDisplay={this.state.forceGreen} />

                <GamePiece className="red-btn" id="1"
                           onPress={this.onPress}
                           power={this.getPower}
                           forceDisplay={this.state.forceRed} />

                <GamePiece className="yellow-btn" id="2"
                           onPress={this.onPress}
                           power={this.getPower}
                           forceDisplay={this.state.forceYellow} />

                <GamePiece className="blue-btn" id="3"
                           onPress={this.onPress}
                           power={this.getPower}
                           forceDisplay={this.state.forceBlue} />

                <Console
                    power={this.getPower}
                    strict={this.getStrict}
                    count={this.getCount}
                    togglePower={this.togglePower}
                    toggleStrict={this.toggleStrict} />

            </div>
        );
    }
});