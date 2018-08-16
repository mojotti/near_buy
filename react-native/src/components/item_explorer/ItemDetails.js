import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import ItemDetailsImageCarousel from './ItemDetailsImageCarousel';
import { getNumOfPictures } from '../../networking/networking';
import { localhost } from '../../static/constants';


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
      <View style={{ flex: 1 }}>
        <ItemDetailsImageCarousel images={this.state.imageUrls} />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { item } = ownProps.navigation.state.params;
  const { token } = state.authorizationReducer;
  return { item, token };
};

const ItemDetails = connect(mapStateToProps, null)(_ItemDetails);
export default ItemDetails;
