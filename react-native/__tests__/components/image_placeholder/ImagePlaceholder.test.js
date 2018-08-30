import React from 'react';
import { shallow } from 'enzyme';
import ImagePlaceholder from '../../../src/components/image_placeholder/ImagePlaceholder';

describe('<ImagePlaceholder />', () => {
  test('shows placeholder image when image is not loaded', () => {
    const imagePlaceHolder = shallow(<ImagePlaceholder url={'foo.com'} />);

    expect(imagePlaceHolder).toMatchSnapshot();
  });

  test('does not show placeholder image when image is loaded', () => {
    const imagePlaceHolder = shallow(<ImagePlaceholder url={'foo.com'} />);
    imagePlaceHolder.instance()._onLoad();

    expect(imagePlaceHolder).toMatchSnapshot();
  });
});
