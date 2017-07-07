import './gamecontrols.scss';

module.exports = React.createClass({

    render: function() {

        var powerClass = "switch";
        if(this.props.power())
            powerClass += "-on";

        var strictClass = "switch";
        if(this.props.strict())
            strictClass += "-on";

        return (
            <div className="control-container">

                <div className="inline">
                    <button className={powerClass}
                            onClick={this.props.togglePower}></button>
                    <div> On/Off </div>
                </div>

                <div className="inline">
                    <button className={strictClass}
                            onClick={this.props.toggleStrict}></button>
                    <div> Strict </div>
                </div>

            </div>
        );
    }
});
