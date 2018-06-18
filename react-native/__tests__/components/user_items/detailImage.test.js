import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { _DetailImage } from '../../../src/components/user_items/DetailImage';

jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn(() => Promise.resolve('./image.jpg')),
    openCamera: jest.fn(() => Promise.resolve('./image.jpg')),
  };
});

describe('<DetailImage />', () => {
  beforeEach(() => {
    Alert.alert = jest.fn();
  });

  test('renders correctly', () => {
    const detailImage = shallow(
      <_DetailImage
        url="foo.bar.png"
        id={1}
        token="foo"
        onImageUpload={() => {}}
        numOfPics={1}
      />
    );

    expect(detailImage).toMatchSnapshot();
  });

  test('renders placeholder when url is not given', () => {
    const detailImage = shallow(
      <_DetailImage
        url=""
        id={1}
        token="foo"
        onImageUpload={() => {}}
        numOfPics={1}
      />
    );

    expect(detailImage).toMatchSnapshot();
  });

  test('placeholder handles image selection on press', () => {
    const detailImage = shallow(
      <_DetailImage
        url=""
        id={1}
        token="foo"
        onImageUpload={() => {}}
        numOfPics={1}
      />
    );

    detailImage
      .dive()
      .find('TouchableHighlight')
      .simulate('Press');

    expect(Alert.alert.mock.calls[0][0]).toEqual('Select picture');
    expect(Alert.alert.mock.calls[0][1]).toEqual(
      'Select from gallery or take a new one with camera'
    );
    expect(Alert.alert.mock.calls[0][2]).toMatchSnapshot();
  });

  test('handleNewImage sends item to db on success', async () => {
    const detailImage = shallow(
      <_DetailImage
        url=""
        id={1}
        token="foo"
        onImageUpload={() => {}}
        numOfPics={1}
      />
    );

    const sendItemToDbSpy = jest.spyOn(detailImage.instance(), 'sendItemToDb');
    await detailImage.instance().handleNewImage();

    expect(sendItemToDbSpy.mock.calls.length).toEqual(1);
    expect(sendItemToDbSpy.mock.calls[0][0]).toEqual('./image.jpg');
  });
});
