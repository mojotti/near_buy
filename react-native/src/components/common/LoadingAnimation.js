import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import dinoAnimation from '../../static/animations/dino_dance.json';
import loadingAnimation from '../../static/animations/loading.json';
import chickenAnimation from '../../static/animations/funky_chicken.json';
import penguinAnimation from '../../static/animations/techno_penguin.json';
import { styles } from '../../static/styles/LoadingAnimationStyles';


export default class LoadingAnimation extends React.Component {
  _getAnimation = () => {
    if (this.props.animation === 'dino') {
      return dinoAnimation;
    }
    if (this.props.animation === 'chickenAnimation') {
      return chickenAnimation;
    }
    if (this.props.animation === 'penguinAnimation') {
      return penguinAnimation;
    }
    return loadingAnimation;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.topText}</Text>
        <View style={styles.viewWrapper}>
          <LottieView source={this._getAnimation()} autoPlay loop />
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
  animation: PropTypes.string.isRequired,
};

