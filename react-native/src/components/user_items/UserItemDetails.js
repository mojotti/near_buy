import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Carousel from 'react-native-looped-carousel';
import { connect } from 'react-redux';

import { localhost } from '../../static/constants';
import DetailImage from './DetailImage';
import { styles } from '../../static/styles/UserItemDetailsStyles';
import { ItemDetails } from '../new_item/ItemDetails';
import DeleteButton from './DeleteButton';

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
      imageUrls: [],
    };

    this.fetchItems = params.fetchItems;
  }

  static navigationOptions = ({ navigation }) => ({
    title:
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.title === 'undefined'
        ? ''
        : navigation.state.params.title,
  });

  componentDidMount() {
    this.getNumOfPictures().then(numOfPics => this.getImageUrls(numOfPics));
    this.props.navigation.setParams({ title: this.state.title });
  }

  getHeaders = () => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.props.token}`);
    return headers;
  };

  getNumOfPictures = () => {
    const url = `http://${localhost}:5000/api/v1.0/${
      this.props.navigation.state.params.item.id
    }/num_of_images`;
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson.num_of_images;
      })
      .catch(error => {
        console.error(error);
        return 0;
      });
  };

  getImageUrls = numOfImages => {
    for (let i = 0; i < numOfImages; i++) {
      const imagePath = `http://${localhost}:5000/api/v1.0/${
        this.state.id
      }/image${i}.jpg`;

      this.setState(prevState => {
        let images = prevState.imageUrls;
        images[i] = imagePath;
        return images;
      });
    }
  };

  handleTitleChange = text => {
    this.setState({ title: text });
  };

  handleDescriptionChange = text => {
    this.setState({ description: text });
  };

  handlePriceChange = text => {
    this.setState({ price: text });
  };

  render() {
    const itemDetailsProps = {
      onTitleChange: this.handleTitleChange,
      onDescriptionChange: this.handleDescriptionChange,
      onPriceChange: this.handlePriceChange,
      title: this.state.title,
      description: this.state.description,
      price: this.state.price,
    };

    console.log('state', this.state);

    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.headerText}>Pictures</Text>
          <Carousel
            style={styles.carousel}
            autoplay={false}
            pageInfo
            currentPage={0}
            onAnimateNextPage={p => console.log(p)}
          >
            <DetailImage url={this.state.imageUrls[0]} />
            <DetailImage url={this.state.imageUrls[1]} />
            <DetailImage url={this.state.imageUrls[2]} />
            <DetailImage url={this.state.imageUrls[3]} />
          </Carousel>
          <Text style={styles.headerText}>Edit details</Text>
          <ItemDetails {...itemDetailsProps} />
          <DeleteButton
            id={this.state.id}
            token={this.props.token}
            navigation={this.props.navigation}
            fetchItems={this.fetchItems}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ token: state.authorizationReducer.token });

const UserItemDetails = connect(mapStateToProps, null)(_UserItemDetails);
export default UserItemDetails;
