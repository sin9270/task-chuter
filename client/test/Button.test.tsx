import { shallow } from 'enzyme';
import * as React from 'react';

import Button from '../src/components/atoms/Button';

describe('Test Button', (): void => {
  const testProps = {
    children: 'Test Button',
    onClick: jest.fn(),
  };

  it('子要素の文字列が表示される', (): void => {
    const wrapper = shallow(<Button {...testProps} />);
    expect(wrapper.text()).toBe(testProps.children);
  });

  it('ボタンをクリックするとclickイベントが発火する', (): void => {
    const wrapper = shallow(<Button {...testProps} />);
    wrapper.simulate('click');
    expect(testProps.onClick).toHaveBeenCalled();
  });
});
