import React from 'react';
import { shallow } from 'enzyme';
import { _DetailImage } from '../../../src/components/user_items/DetailImage';

describe('<DetailImage />', () => {
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
});
