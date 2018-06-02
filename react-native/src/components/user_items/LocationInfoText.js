import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../static/styles/UserItemDetailsStyles';

export default class LocationInfoText extends React.Component {
  render() {
    return (
      <View style={{ alignSelf: 'stretch' }}>
        <Text
          style={styles.infoText}
        >{`\u2022 Your exact location is not visible to others`}</Text>
        <Text style={styles.infoText}>
          {`\u2022`}
          <Text style={{ color: 'blue' }}> Blue</Text>
          <Text>{` color indicates your item's location`}</Text>
        </Text>
        <Text style={styles.infoText}>
          {`\u2022`}
          <Text style={{ color: 'red' }}> Red</Text>
          <Text>{` color indicates your location`}</Text>
        </Text>
      </View>
    );
  }
}
