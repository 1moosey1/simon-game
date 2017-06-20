import style from './gamecounter.scss';

module.exports = React.createClass({

    render: function() {

        var className = "counter";
        if (this.props.power())
            className += "-on";

        return (
            <div className="counter-container">
                <div className={className}> {this.props.count()} </div>
                <div> COUNT </div>
            </div>
        );
    }
});