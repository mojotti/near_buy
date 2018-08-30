import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';

import { _DetailImage } from '../../../src/components/user_items/DetailImage';

jest.mock('react-native-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
    fetch: () => Promise.resolve({ json: () => Promise.resolve({ ok: true }) }),
    wrap: () => '12345',
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

  test('alert has correct texts', () => {
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

  test('alert handles gallery image selection on press', () => {
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

    const handleGalleryImageSpy = jest.spyOn(
      detailImage.instance(),
      'handleGalleryImage'
    );

    Alert.alert.mock.calls[0][2][1].onPress();
    expect(handleGalleryImageSpy.mock.calls.length).toEqual(1);
  });

  test('alert handles camera image selection on press', () => {
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

    const handleNewImageSpy = jest.spyOn(
      detailImage.instance(),
      'handleNewImage'
    );

    Alert.alert.mock.calls[0][2][2].onPress();
    expect(handleNewImageSpy.mock.calls.length).toEqual(1);
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

  test('handleGalleryImage sends item to db on success', async () => {
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
    await detailImage.instance().handleGalleryImage();

    expect(sendItemToDbSpy.mock.calls.length).toEqual(1);
    expect(sendItemToDbSpy.mock.calls[0][0]).toEqual('./image.jpg');
  });

  test('sends item to db', async () => {
    const onImageUploadSpy = jest.fn();

    const detailImage = shallow(
      <_DetailImage
        url=""
        id={1}
        token="foo"
        onImageUpload={onImageUploadSpy}
        numOfPics={1}
      />
    );

    const image = 'foo.png';
    await await detailImage.instance().sendItemToDb(image);

    expect(onImageUploadSpy.mock.calls.length).toEqual(1);
  });
});
