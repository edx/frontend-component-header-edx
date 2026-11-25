/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';

import HeaderNoticeSlot from './index';

jest.mock('@openedx/frontend-plugin-framework', () => ({
  PluginSlot: ({ id }) => <div data-testid="plugin-slot" data-slot-id={id} />,
}));

describe('<HeaderNoticeSlot />', () => {
  it('renders the header_notice_slot plugin slot', () => {
    render(<HeaderNoticeSlot />);

    expect(screen.getByTestId('plugin-slot')).toHaveAttribute('data-slot-id', 'header_notice_slot');
  });
});
