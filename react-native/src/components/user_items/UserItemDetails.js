import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

class _UserItemDetails extends Component {
  render() {
    const { params } = this.props.navigation.state;
    const itemId = params ? params.id : null;

    return (
      <View style={{ marginTop: 22 }}>
        <Text>{`id is ${itemId}`}</Text>
      </View>
    );
  }
}

mapStateToProps = () => {
  return {};
};

const UserItemDetails = connect(mapStateToProps, null)(_UserItemDetails);
export default UserItemDetails;
