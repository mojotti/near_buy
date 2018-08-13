import React from 'react';
import { shallow } from 'enzyme';
import ImagePlaceholder from '../../../src/components/image_placeholder/ImagePlaceholder';

const DATE_TO_USE = new Date('2016');
const _Date = Date;
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;

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
