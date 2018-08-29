import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-navigation', () => {
  return {
    withNavigation: jest.fn(),
    NavigationActions: {
      reset: jest.fn(),
      navigate: jest.fn()
    }
  };
});
