import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-native-gifted-chat', () => {
  return {
    GiftedChat: jest.fn()
  };
});

jest.mock('react-native-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
    fetch: () => Promise.resolve({ json: () => Promise.resolve('success') }),
    wrap: () => '12345',
  };
});

jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn(() => Promise.resolve('./image.jpg')),
    openCamera: jest.fn(() => Promise.resolve('./image.jpg')),
  };
});

jest.mock('react-navigation', () => {
  return {
    withNavigation: jest.fn(),
    NavigationActions: {
      reset: jest.fn(() => {}),
      navigate: jest.fn(() => {}),
    },
  };
});
