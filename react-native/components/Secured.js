import React, { Component } from 'react';
import Items from './Items.js';
import NewItem from './NewItem';
import { StackNavigator} from 'react-navigation';


const App = StackNavigator({
    Items: { screen: Items },
    NewItem: { screen: NewItem },
});

class Secured extends Component {
    render() {
        return (
            <App />
        );
    }
}


export default Secured;
