import './game.scss';
import GamePiece from './GamePiece/GamePiece.jsx';
import Console from './GameConsole/GameConsole.jsx';

let audioLink = "https://s3.amazonaws.com/freecodecamp/";

module.exports = React.createClass({

    sounds: [], pattern: [],
    patternIndex: 0, userIndex: 0, count: 0,
    displayingPattern: false, transitioning: false,

    getInitialState: function() {

        // Initialize sounds
        this.sounds = [
            new Audio(audioLink + "simonSound1.mp3"), // Green sound effect
            new Audio(audioLink + "simonSound2.mp3"), // Red sound effect
            new Audio(audioLink + "simonSound3.mp3"), // Yellow sound effect
            new Audio(audioLink + "simonSound4.mp3")  // Blue sound effect
        ];

        return {

            power: false, strict: false, displayCount: 0,
            forceGreen: false, forceRed: false,
            forceYellow: false, forceBlue: false
        };
    },

    getPower: function()
        { return this.state.power; },

    getStrict: function()
        { return this.state.strict; },

    getDisplayCount: function()
        { return this.state.displayCount; },

    togglePower: function() {

        if(this.state.power){

            this.setState({

                power: false, strict: false, displayCount: 0,
                forceGreen: false, forceRed: false,
                forceYellow: false, forceBlue: false
            });
        }
        else {

            this.resetGame();
            this.setState({ power: true }, this.startLevel);
        }
    },

    toggleStrict: function() {

        if(this.state.power)
            this.setState({ strict: !this.state.strict });
    },

    // Called when the game pieces are pressed
    onPress: function(evtObj) {

        // Only play sounds when power is on and not displaying level
        if(this.state.power && !this.displayingPattern && !this.transitioning) {

            let id = parseInt(evtObj.target.id);

            this.playSound(id);
            this.checkInput(id);
        }
    },

    // Play a sound with event listener disabled
    playSound: function(id) {

        this.sounds[id].pause();
        this.sounds[id].currentTime = 0;
        this.sounds[id].play();
    },

    checkInput: function(id) {

        // Check if the user pressed the correct button
        if(this.pattern[this.userIndex] === id) {

            this.userIndex++;

            // Check if the level is complete
            if (this.userIndex === this.pattern.length)
                this.nextLevel(1000);
        }

        // User pressed wrong button
        else {

            if(this.state.strict)
                this.resetGame();

            this.restartLevel();
        }
    },

    expandPattern: function() {

        // Generate and add the new button to pattern
        let randBtn = Math.floor(Math.random() * 4);
        this.pattern.push(randBtn);
    },

    nextLevel: function(delay = 0) {

        this.transitioning = true;
        this.setState({ displayCount: "!!" });

        this.count++;
        this.expandPattern();
        window.setTimeout(this.startLevel, delay);
    },

    restartLevel: function() {

        this.transitioning = true;

        this.setState({ displayCount: "X" });
        window.setTimeout(this.startLevel, 1000);
    },

    startLevel: function() {

        this.setState({ displayCount: this.count });

        this.userIndex = 0;
        this.patternIndex = 0;

        this.transitioning = false;
        this.displayingPattern = true;
        this.displayPattern();
    },

    // Prepare next button to be displayed
    prepareDisplay: function() {

        // Stop simulating button press
        if (this.state.forceGreen)
            this.setState({forceGreen: false});

        else if (this.state.forceRed)
            this.setState({forceRed: false});

        else if (this.state.forceYellow)
            this.setState({forceYellow: false});

        else if (this.state.forceBlue)
            this.setState({forceBlue: false});

        // Move to the next button to be displayed
        this.patternIndex++;

        // Check if there is a next button to be displayed
        if (this.state.power && this.patternIndex < this.pattern.length ) {

            // Wait 350 milliseconds before displaying next button
            window.setTimeout(this.displayPattern, 350);
        }
        else
            this.displayingPattern = false;
    },

    displayPattern: function () {

        // Display next button in the pattern and play associated sound
        let btnValue = this.pattern[this.patternIndex],
        soundDuration = this.sounds[btnValue].duration * 1000;

        if(btnValue === 0)
            this.setState({forceGreen: true});

        else if(btnValue === 1)
            this.setState({forceRed: true});

        else if(btnValue === 2)
            this.setState({forceYellow: true});

        else if(btnValue === 3)
            this.setState({forceBlue: true});

        this.playSound(btnValue);
        window.setTimeout(this.prepareDisplay, soundDuration);
    },

    resetGame: function() {

        this.count = 1;
        this.pattern = [];
        this.expandPattern();
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
                    getPower={this.getPower}
                    getStrict={this.getStrict}
                    getDisplayCount={this.getDisplayCount}
                    togglePower={this.togglePower}
                    toggleStrict={this.toggleStrict} />

            </div>
        );
    }
});