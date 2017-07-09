import './gamecontrols.scss';

module.exports = React.createClass({

    render: function() {

        var powerClass = "switch";
        if(this.props.getPower())
            powerClass += "-on";

        var strictClass = "switch";
        if(this.props.getStrict())
            strictClass += "-on";

        return (
            <div className="control-container">

                <div className="inline">
                    <button className={powerClass}
                            onClick={this.props.togglePower}> </button>
                    <div> On/Off </div>
                </div>

                <div className="inline">
                    <button className={strictClass}
                            onClick={this.props.toggleStrict}> </button>
                    <div> Strict </div>
                </div>

            </div>
        );
    }
});
