import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import 'react-native-image-crop-picker';
import { ItemDetails } from '../../../src/components/new_item/ItemDetails';

const onTitleChangeSpy = sinon.spy();
const onDescriptionChangeSpy = sinon.spy();
const onPriceChangeSpy = sinon.spy();

const PROPS = {
  onTitleChange: onTitleChangeSpy,
  onDescriptionChange: onDescriptionChangeSpy,
  onPriceChange: onPriceChangeSpy,
};

describe('<ItemDetails />', () => {
  test('on detail change state changes and prop functions are called', () => {
    const itemDetailsComponent = shallow(<ItemDetails {...PROPS} />);

    const newInput = 'bla bla bla';
    const textInputs = itemDetailsComponent.find('TextInput');
    textInputs.forEach(textInput => textInput.simulate('ChangeText', newInput));

    expect(itemDetailsComponent.state('title')).toEqual(newInput);
    expect(itemDetailsComponent.state('description')).toEqual(newInput);
    // price allows only numbers
    expect(itemDetailsComponent.state('price')).toEqual('');

    expect(onPriceChangeSpy.called).toBeTruthy();
    expect(onTitleChangeSpy.called).toBeTruthy();
    expect(onDescriptionChangeSpy.called).toBeTruthy();
  });

  test('numbers are allowed for price', () => {
    const itemDetailsComponent = shallow(<ItemDetails {...PROPS} />);

    const newInput = '123';
    const textInputs = itemDetailsComponent.find('TextInput');
    textInputs.forEach(textInput => textInput.simulate('ChangeText', newInput));

    expect(itemDetailsComponent.state('title')).toEqual(newInput);
    expect(itemDetailsComponent.state('description')).toEqual(newInput);
    expect(itemDetailsComponent.state('price')).toEqual(newInput);
  });

  test('numbers are allowed for price', () => {
    const itemDetailsComponent = shallow(<ItemDetails {...PROPS} />);

    const newInput = '1a2b3conenoe145';
    const expectedPrice = '123145';
    const textInputs = itemDetailsComponent.find('TextInput');
    textInputs.forEach(textInput => textInput.simulate('ChangeText', newInput));

    expect(itemDetailsComponent.state('price')).toEqual(expectedPrice);
  });
});
