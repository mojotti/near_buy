import React from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../../static/styles/NewItemStyles';

export class ItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      price: '',
      description: '',
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  }

  componentDidMount() {
    if (this.props.title && this.props.description && this.props.price) {
      this.setState(() => ({
        title: this.props.title,
        description: this.props.description,
        price: this.props.price.toString(),
      }));
    }
  }

  handleTitleChange(text) {
    this.setState({ title: text });
    this.props.onTitleChange(text);
  }

  handleDescriptionChange(text) {
    this.setState({ description: text });
    this.props.onDescriptionChange(text);
  }

  handlePriceChange(text) {
    let newText = '';
    const numbers = '0123456789';

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText += text[i];
      }
    }

    this.setState({ price: newText });
    this.props.onPriceChange(newText);
  }

  render() {
    return (
      <View>
        <View style={styles.itemDetailContainer}>
          <TextInput
            placeholder="Title"
            autoCapitalize="sentences"
            autoCorrect={false}
            maxLength={40}
            keyboardType="email-address"
            value={this.state.title}
            onChangeText={text => this.handleTitleChange(text)}
            style={[styles.itemDetails]}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.itemDescriptionContainer}>
          <TextInput
            placeholder="Description"
            autoCapitalize="sentences"
            maxLength={400}
            autoCorrect={false}
            keyboardType="email-address"
            value={this.state.description}
            multiline={true}
            onChangeText={text => this.handleDescriptionChange(text)}
            style={[styles.itemDetails]}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.itemDetailContainer}>
          <TextInput
            placeholder="Price"
            autoCorrect={false}
            autoFocus={false}
            keyboardType="numeric"
            maxLength={5}
            value={this.state.price}
            onChangeText={text => this.handlePriceChange(text)}
            style={[styles.itemDetails]}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  }
}

ItemDetails.defaultProps = {
  title: '',
  description: '',
  price: null,
};

ItemDetails.propTypes = {
  onTitleChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.number,
};
