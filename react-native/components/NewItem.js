'use strict';

import React, { Component } from 'react';
import store from '../redux';
import { Alert,
    Button,
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { localhost,
    widthWithThirtyPercentPadding} from "../src/static/constants";


export class NewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            price: '',
            description: '',
        };
    }

    static navigationOptions = {
        title: 'Sell item',
    };

    getHeaders() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${store.getState().auth.token}`);
        return headers;
    }

    resetNavigationAndNavigateToRoute(targetRoute) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    handleNewItemCreation () {
        const { title, price, description } = this.state;
        if (title == '' || price == '' || description == '') {
            Alert.alert('Invalid values', 'Enter at least price, title and description');
            return;
        }
        let url = `http://${localhost}:5000/api/v1.0/items`;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'title': title,
                'price': price,
                'description': description
            }),
            headers: this.getHeaders()
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("pure " + responseJson.item.title);
                if (responseJson.item && responseJson.item.title === title) {
                    this.resetNavigationAndNavigateToRoute('Items');
                } else {
                    Alert.alert('Item creation failed', 'Something went wrong');
                }
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    }

    onPriceChange(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }
        this.setState({price: newText})
    }

    render() {
        return (
            <View style={[styles.container]}>
                <TextInput
                    placeholder='Title'
                    autoCapitalize='sentences'
                    autoCorrect={false}
                    autoFocus={true}
                    maxLength = {20}
                    keyboardType='email-address'
                    value={this.state.title}
                    onChangeText={(text) => this.setState({ title: text })}
                    style={[styles.itemDetails]}
                />
                <TextInput
                    placeholder='Description'
                    autoCapitalize='sentences'
                    maxLength = {60}
                    autoCorrect={false}
                    autoFocus={false}
                    keyboardType='email-address'
                    value={this.state.description}
                    onChangeText={(text) => this.setState({ description: text })}
                    style={[styles.itemDetails]}
                />
                <KeyboardAvoidingView
                    behavior='padding'
                    keyboardVerticalOffset={164}
                >
                    <TextInput
                        placeholder='Price'
                        autoCorrect={false}
                        autoFocus={false}
                        keyboardType='numeric'
                        maxLength = {5}
                        value = {this.state.price}
                        onChangeText = {(text) => this.onPriceChange(text)}
                        style={[styles.itemDetails]}
                    />
                    <View style = {{paddingTop: 20}}></View>
                    <Button
                        onPress = {() => this.handleNewItemCreation()}
                        title = {'Submit item'}
                    />
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    itemDetails: {
        width: widthWithThirtyPercentPadding,
        alignItems: 'center',
    }
});


export default NewItem;
