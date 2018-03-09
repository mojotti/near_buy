import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import 'react-native-image-crop-picker';
import { ImageRow } from '../../../components/new_item/ImageRow';

jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn(() => Promise.resolve()),
    openCamera: jest.fn(() => Promise.resolve()),
  };
});

const PROPS_NO_IMAGES = {
  onImageSelected: () => {},
  leftButtonId: 2,
  rightButtonId: 3,
  images: [null, null, null, null],
};

const PROPS_WITH_IMAGES = {
  onImageSelected: () => {},
  leftButtonId: 0,
  rightButtonId: 1,
  images: [{ path: 'foo/bar.png' }, { path: 'baz/foo.png' }],
};

describe('<ImageRow />', () => {
  test('when there is no images, empty image buttons are rendered', () => {
    const imageRowComponent = shallow(<ImageRow {...PROPS_NO_IMAGES} />);
    expect(imageRowComponent).toMatchSnapshot();
  });

  test('when there are images, images are rendered', () => {
    const imageRowComponent = shallow(<ImageRow {...PROPS_WITH_IMAGES} />);
    expect(imageRowComponent).toMatchSnapshot();
  });

  test('image is selected for empty image', () => {
    const handleImageSelectionSpy = sinon.spy(
      ImageRow.prototype,
      'handleImageSelection',
    );
    const imageRowComponent = shallow(<ImageRow {...PROPS_NO_IMAGES} />);
    imageRowComponent
      .find('IconButton')
      .first()
      .simulate('Press');

    expect(handleImageSelectionSpy.callCount).toEqual(1);
    handleImageSelectionSpy.restore();
  });

  test('image is selected for already selected image', () => {
    const handleImageSelectionSpy = sinon.spy(
      ImageRow.prototype,
      'handleImageSelection',
    );

    const imageRowComponent = shallow(<ImageRow {...PROPS_WITH_IMAGES} />);
    imageRowComponent
      .find('TouchableHighlight')
      .first()
      .simulate('Press');

    expect(handleImageSelectionSpy.callCount).toEqual(1);
  });

  test('onImageSelected is called when selecting camera image', () => {
    const props = {
      onImageSelected: sinon.spy(),
      leftButtonId: 0,
      rightButtonId: 1,
      images: [{ path: 'foo/bar.png' }, { path: 'baz/foo.png' }],
    };

    const imageRowComponent = shallow(<ImageRow {...props} />);
    const imageId = 0;

    imageRowComponent.instance().handleNewImage(imageId);
  });
});
