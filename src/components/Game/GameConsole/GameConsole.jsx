import './gameconsole.scss';
import Counter from './GameCounter.jsx';
import Controls from './GameControls.jsx';
import Footer from '../../Footer/Footer.jsx';

module.exports = React.createClass({

    render: function() {

        return (
            <div className="fgc">

                <Counter
                    getPower={this.props.getPower}
                    getDisplayCount={this.props.getDisplayCount} />

                <Controls
                    getPower={this.props.getPower}
                    getStrict={this.props.getStrict}
                    togglePower={this.props.togglePower}
                    toggleStrict={this.props.toggleStrict} />

                <Footer />

            </div>
        );
    }
});