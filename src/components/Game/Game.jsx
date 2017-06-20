import styles from './game.scss';
import GamePiece from './GamePiece/GamePiece.jsx';
import Console from './GameConsole/GameConsole.jsx';

module.exports = React.createClass({

    getInitialState: function() {

        return {

            power: false, strict: false,
            count: 0, pattern: []
        };
    },

    getPower: function() {
        return this.state.power;
    },

    getStrict: function() {
        return this.state.strict;
    },

    getCount: function() {
        return this.state.count;
    },

    togglePower: function() {

        if(this.state.power){

            this.resetGame();
            this.setState({ power: false, strict: false });
        }
        else
            this.setState({ power: true }, this.modifyCount);
    },

    toggleStrict: function() {

        if(this.state.power)
            this.setState({ strict: !this.getStrict() });
    },

    modifyCount: function(count = 1) {
        this.setState({ count: count }, this.startLevel);
    },

    startLevel: function() {

        var pattern, count, i, randBtn;
        pattern = this.state.pattern;

        count = this.getCount() - pattern.length;
        if (count < 0) {

            pattern = [];
            count = this.getCount();
        }

        for(i = 0; i < count; ++i) {

            randBtn = Math.floor(Math.random() * 4) + 1;
            pattern.push(randBtn);
        }

        this.presentPattern(pattern);
    },

    presentPattern: function (pattern) {

        var lights = [
            document.getElementById("1"),
            document.getElementById("2"),
            document.getElementById("3"),
            document.getElementById("4")];

        console.log(this.state.pattern);

        for(var i = 0; i < pattern.length; ++i) {

            lights[pattern[i] - 1].click();
        }
    },

    resetGame: function() {

        this.setState({ count: 0 });
        this.state.pattern = [];
    },

    render: function() {

        return (
            <div className="bgc">

                <GamePiece className="green-btn" id="1"
                           power={this.getPower} />

                <GamePiece className="red-btn" id="2"
                           power={this.getPower} />

                <GamePiece className="yellow-btn" id="3"
                           power={this.getPower} />

                <GamePiece className="blue-btn" id="4"
                           power={this.getPower} />

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