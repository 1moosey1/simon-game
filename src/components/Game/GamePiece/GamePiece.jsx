import styles from './gamepiece.scss';

module.exports = React.createClass({

    getInitialState: function() {

        return {
            audio: new Audio(
                "https://s3.amazonaws.com/freecodecamp/simonSound" +
                this.props.id + ".mp3")
        }
    },

    onClick: function() {

        if(this.props.power()) {

            var audio = this.state.audio;
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    },

    render: function() {

        var className = this.props.className;
        if(this.props.power())
            className += "-on";

        return (
            <div className={className} id={this.props.id}
                 onClick={this.onClick}>
            </div>
        );
    }
});