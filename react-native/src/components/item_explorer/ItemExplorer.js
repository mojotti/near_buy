'use strict';

import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-snap-carousel';
import ItemCard from './ItemCard';
import { styles } from '../../static/styles/ItemsStyles';

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

  _renderItem({ item, index }) {
    return <ItemCard item={item} />;
  }

  render() {
    const entries = [
      {
        title: 'Tuote1',
        latitude: 64.989806,
        longitude: 25.552602,
      },
      {
        title: 'Tuote2',
        latitude: 64.989806,
        longitude: 25.552602,
      },
      {
        title: 'Tuote3',
        latitude: 64.989806,
        longitude: 25.552602,
      },
      {
        title: 'Tuote4',
        latitude: 64.989806,
        longitude: 25.552602,
      },
    ];
    return (
      <Carousel
        ref={c => {
          this._carousel = c;
        }}
        data={entries}
        renderItem={this._renderItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={() => console.log('i was clicked')}
        slideStyle={{ justifyContent: 'center' }}
        layout={'stack'}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps, null)(ItemExplorer);
