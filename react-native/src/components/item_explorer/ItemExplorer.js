'use strict';

import React from 'react';
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-snap-carousel';
import ItemCard from './ItemCard';
import { styles } from '../../static/styles/ItemExplorerStyles';

const { width } = Dimensions.get('window');

export class ItemExplorer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'Item Explorer',
      headerLeft: (
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
            <Icon name="menu" size={30} color="#4d4dff" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: (
        <Text onPress={() => navigate('NewItem')} style={styles.headerButton}>
          New item
        </Text>
      ),
    };
  };

  _renderItems = () => {
    return this.props.items === 'no items'
      ? this._renderNoItems()
      : this._renderCarousel();
  };

  _renderLoader = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4d4dff" />
      </View>
    );
  };

  _renderCarousel = () => {
    return (
      <Carousel
        ref={c => {
          this._carousel = c;
        }}
        data={this.props.items}
        renderItem={this._renderItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={() => console.log('i was clicked')}
        slideStyle={{ justifyContent: 'center' }}
        layout={'stack'}
      />
    );
  };

  _renderItem({ item, index }) {
    return <ItemCard item={item} />;
  }

  _renderNoItems = () => {
    return (
      <View style={[styles.noItemsText, styles.container]}>
        <Text>{`Oops! Could not find any items. Perhaps you are in the middle of nowhere!`}</Text>
      </View>
    );
  };

  render() {
    return this.props.isFetching ? this._renderLoader() : this._renderItems();
  }
}

const mapStateToProps = (state) => {
  console.log('state', state);
  return {
    isFetching: state.itemExplorerReducer.isFetching,
    items: state.itemExplorerReducer.items,
  };
};

ItemExplorer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(ItemExplorer);
