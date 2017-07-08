import './gamepiece.scss';

module.exports = React.createClass({

    render: function() {

        let className = this.props.className;

        // If forcing "simulating press" then change css to reflect
        if(this.props.forceDisplay) {
            className += "-force";
        }

        // If game is on then allow css active pseudo element
        else if(this.props.power())
            className += "-on";

        return (
            <div className={className} id={this.props.id}
                 onMouseDown={this.props.onPress}> </div>
        );
    }
});