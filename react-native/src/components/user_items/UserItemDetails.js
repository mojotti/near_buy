import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { localhost } from '../../static/constants';
import { styles } from '../../static/styles/UserItemDetailsStyles';
import { ItemDetails } from '../new_item/ItemDetails';
import DeleteButton from './DeleteButton';
import SaveButton from './SaveButton';
import UserItemMapView from './UserItemMapView';
import { getNumOfPictures } from '../../networking/ApiCalls';
import ImageCarousel from './ImageCarousel';
import LocationInfoText from './LocationInfoText';
import UpdateLocationButton from './UpdateLocationButton';
import { baseStyles } from '../../static/styles/BaseStyles';

export class _UserItemDetails extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const item = params ? params.item : null;

    this.state = {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      created: item.item_created,
      imageUrls: [],
      longitude: item.longitude,
      latitude: item.latitude,
    };

    this.numOfImages = 0;
    this.fetchItems = params.fetchItems;
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const item = params ? params.item : null;

    return {
      title:
        typeof navigation.state.params === 'undefined' ||
        typeof navigation.state.params.title === 'undefined'
          ? ''
          : navigation.state.params.title,
      headerRight: params.isEdited && (
        <SaveButton
          id={item.id}
          navigation={navigation}
          fetchItems={params.fetchItems}
          item={item}
        />
      ),
    };
  };

  componentDidMount() {
    this.updateImages();
    this.props.navigation.setParams({ title: this.state.title });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.title !== this.state.title ||
      prevState.description !== this.state.description ||
      prevState.price !== this.state.price ||
      prevState.longitude !== this.state.longitude ||
      prevState.latitude !== this.state.latitude
    ) {
      this.props.navigation.setParams({ item: this.state, isEdited: true });
    }
  }

  updateImages = () => {
    const itemId = this.props.navigation.state.params.item.id;
    getNumOfPictures(itemId, this.props.token).then(numOfPics => {
      this.numOfImages = numOfPics;
      this.getImageUrls(numOfPics);
    });
  };

  getImageUrls = numOfImages => {
    for (let i = 0; i < numOfImages; i++) {
      const imagePath = `http://${localhost}:5000/api/v1.0/${
        this.state.id
      }/image${i}.jpg`;

      this.setState(prevState => {
        const images = prevState.imageUrls;
        images[i] = imagePath;
        return images;
      });
    }
  };

  handleTitleChange = text => {
    this.setState(() => ({ title: text }));
  };

  handleDescriptionChange = text => {
    this.setState(() => ({ description: text }));
  };

  handlePriceChange = text => {
    this.setState(() => ({ price: text }));
  };

  updateLocation = () => {
    this.setState(() => ({
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
    }));
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

    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={baseStyles.headerText}>Pictures</Text>
          <ImageCarousel
            imageUrls={this.state.imageUrls}
            id={this.state.id}
            onImageUpload={this.updateImages}
            numOfPics={this.numOfImages}
          />
          <Text style={baseStyles.headerText}>Edit details</Text>
          <ItemDetails {...itemDetailsProps} />
          <Text style={baseStyles.headerText}>Location</Text>
          <LocationInfoText />
          <UserItemMapView
            longitude={this.state.longitude}
            latitude={this.state.latitude}
            currentLocation={this.props.location}
          />
          <UpdateLocationButton updateLocation={this.updateLocation} />
          <Text style={baseStyles.headerText}>Fun facts</Text>
          <Text style={styles.paragraph}>
            {`\u2022 You decided to get rid of this item ${new Date(
              this.state.created
            ).toDateString()}`}
          </Text>
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

const mapStateToProps = state => {
  const { latitude, longitude } = state.locationReducer;
  return {
    token: state.authorizationReducer.token,
    location: {
      latitude,
      longitude,
    },
  };
};

const UserItemDetails = connect(mapStateToProps, null)(_UserItemDetails);
export default UserItemDetails;
