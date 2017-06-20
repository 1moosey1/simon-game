import styles from './gameconsole.scss';
import Counter from './GameCounter.jsx';
import Controls from './GameControls.jsx';
import Footer from '../../Footer/Footer.jsx';

module.exports = React.createClass({

    render: function() {

        return (
            <div className="fgc">

                <Counter
                    power={this.props.power}
                    count={this.props.count} />

                <Controls
                    power={this.props.power}
                    strict={this.props.strict}
                    togglePower={this.props.togglePower}
                    toggleStrict={this.props.toggleStrict} />

                <Footer />

            </div>
        );
    }
});