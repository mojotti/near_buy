import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import animation from '../../static/animations/dino_dance.json';
import { styles } from '../../static/styles/LoadingAnimationStyles';


export default class LoadingAnimation extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.topText}</Text>
        <View style={styles.viewWrapper}>
          <LottieView source={animation} autoPlay loop />
        </View>
        <Text style={styles.text}>{this.props.bottomText}</Text>
      </View>
    );
  }
}

LoadingAnimation.defaultProps = {
  topText: '',
  bottomText: '',
};

LoadingAnimation.propTypes = {
  topText: PropTypes.string,
  bottomText: PropTypes.string,
};

