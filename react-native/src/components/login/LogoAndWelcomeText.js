import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { styles } from '../../static/styles/LoginStyles';
import { logo } from '../../static/constants';

const LOGO = logo;

export default class LogoAndWelcomeText extends Component {
  render() {
    return (
      <View style={styles.logoContainer}>
        <Text style={styles.welcomeText}>Hi! Welcome to</Text>
        <Image resizeMode="contain" style={styles.logo} source={LOGO} />
      </View>
    );

  }
}
