import React from 'react';
import { shallow } from 'enzyme';
import ImageCarousel from '../../../src/components/user_items/ImageCarousel';


describe('ImageCarousel', () => {
  test('renders images', () => {
    const imageUrls = ['foo.com/png', 'bar.com/png'];
    const imageCarousel = shallow(
      <ImageCarousel
        imageUrls={imageUrls}
        id={0}
        onImageUpload={() => {}}
        numOfPics={2}
      />
    );

    expect(imageCarousel).toMatchSnapshot();
  });
});
