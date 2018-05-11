import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

class _UserItemDetails extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const item = params ? params.item : null;

    this.state = {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      photos: [],
    };
  }

  render() {
    return (
      <View style={{ marginTop: 22 }}>
        <Text>{`id is ${this.state.id}`}</Text>
        <Text>{`id is ${this.state.title}`}</Text>
        <Text>{`id is ${this.state.description}`}</Text>
        <Text>{`id is ${this.state.price}`}</Text>
      </View>
    );
  }
}

mapStateToProps = () => {
  return {};
};

const UserItemDetails = connect(mapStateToProps, null)(_UserItemDetails);
export default UserItemDetails;
