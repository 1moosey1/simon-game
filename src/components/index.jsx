import './index.scss';
import Header from './Header/Header.jsx';
import Game from './Game/Game.jsx';

var SimonApp = React.createClass({

    render: function() {

        return (
            <div>
                <Header />
                <Game />
            </div>
        );
    }
});

ReactDOM.render( <SimonApp />,
    document.getElementById("simon-app"));