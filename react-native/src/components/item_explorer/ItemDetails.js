import React from 'react';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ItemDetailsImageCarousel from './ItemDetailsImageCarousel';
import { getNumOfPictures } from '../../networking/networking';
import { localhost } from '../../static/constants';
import { baseStyles } from '../../static/styles/BaseStyles';
import { styles } from '../../static/styles/ItemDetailsStyles';


export class _ItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: ['foo.bar'], // provide some uri while loading actual img uris
    };
  }

  static navigationOptions = ({ navigation }) =>
    ({ title: navigation.state.params.item.title });

  componentWillMount() {
    this.getImageUrls();
  }

  getImageUrls = () => {
    getNumOfPictures(this.props.item.id, this.props.token)
      .then((numOfPics) => {
        this.setImageUrls(numOfPics);
      });
  };

  setImageUrls = (numOfPics) => {
    const urls = [];
    for (let i = 0; i < numOfPics; i++) {
      const imagePath =
        `http://${localhost}:5000/api/v1.0/${this.props.item.id}/image${i}.jpg`;
      urls.push(imagePath);
    }
    this.setState(() => ({ imageUrls: urls }));
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <ItemDetailsImageCarousel images={this.state.imageUrls} />
        <Text style={baseStyles.headerText}>Distance</Text>
        <Text style={styles.plainText}>{this.props.distance}</Text>
        <Text style={baseStyles.headerText}>Description</Text>
        <Text style={styles.plainText}>{this.props.item.description}</Text>
        <Text style={baseStyles.headerText}>Chat</Text>
        <TouchableOpacity style={styles.chatButton}>
          <View style={styles.chatButtonContainer}>
            <FontAwesome name="comments" size={50} color={'#FFFFFF'} />
            <Text style={styles.chatText}>Chat with owner</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { item } = ownProps.navigation.state.params;
  const { distance } = ownProps.navigation.state.params;
  const { token } = state.authorizationReducer;
  return { item, token, distance };
};

const ItemDetails = connect(mapStateToProps, null)(_ItemDetails);
export default ItemDetails;
