import React from 'react';
import { shallow } from 'enzyme';
import LoadingAnimation from '../../../src/components/common/LoadingAnimation';

describe('<LoadingAnimation />', () => {
  test('gets animation', () => {
    let loading = shallow(<LoadingAnimation animation={'dino'} />);
    expect(loading.instance()._getAnimation()).toMatchSnapshot();

    loading = shallow(<LoadingAnimation animation={'penquin'} />);
    expect(loading.instance()._getAnimation()).toMatchSnapshot();

    loading = shallow(<LoadingAnimation animation={'chicken'} />);
    expect(loading.instance()._getAnimation()).toMatchSnapshot();

    loading = shallow(<LoadingAnimation animation={'foo'} />);
    expect(loading.instance()._getAnimation()).toMatchSnapshot();
  });
});

