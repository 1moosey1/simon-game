import './gamecounter.scss';

module.exports = React.createClass({

    render: function() {

        var className = "counter";
        if (this.props.getPower())
            className += "-on";

        return (
            <div className="counter-container">
                <div className={className}> {this.props.getDisplayCount()} </div>
                <div> COUNT </div>
            </div>
        );
    }
});