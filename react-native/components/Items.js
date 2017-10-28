'use strict';

import React from 'react';
import { Button,
    ListView,
    StyleSheet,
    Text,
    View } from 'react-native';
import { logout } from '../redux/actions/auth';
import { connect } from 'react-redux';
import { localhost } from "../src/static/constants";
import { ListViewItem } from "./ListViewItem";

export class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
            data: ''
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        return {
            title: 'Your items',
            headerLeft: (
                <Text
                    onPress={() => navigate('NewItem')}
                    style={{ margin: 10 }}
                >
                    New Item
                </Text>
            ),
            headerRight: null,
        };
    };

    componentDidMount() {
        this.fetchData();
    }

    getHeaders() {
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${this.props.token}`);
        return headers;
    }

    userLogout() {
        this.props.onLogout();
    }

    fetchData() {
        let url = `http://${localhost}:5000/api/v1.0/user/items`;
        fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.handleAllItemsRequest(responseJson);
        })
        .catch((error) => {
        console.error(error);
        });
    }

    handleAllItemsRequest(responseJson) {
        if (responseJson.items === 'no items') {
        this.setState({
            loaded: true,
            data: responseJson.items,
        });
        } else {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseJson.items),
                loaded: true,
                data: responseJson.items,
            });
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                {this.renderUserData()}
                <Button
                    onPress={() => this.userLogout()}
                    title='Logout'
                    style = {{margin: 15}}
                />
            </View>
        );
    }

    renderUserData() {
        if (this.state.loaded === false) {
            return (
                <Text style={[styles.infoText]}>
                    {'Loading user data...'}
                </Text>
            )
        }
        if (this.state.data === 'no items') {
            return (
                <Text style={[styles.infoText]}>
                    {`You don't have any items yet. You should start to sell some shit!`}
                </Text>
            );
        } else {
            return (
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={data => <ListViewItem item={data}/>}
                />
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    infoText: {
        textAlign: 'center',
        padding: 10
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username,
        token: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
