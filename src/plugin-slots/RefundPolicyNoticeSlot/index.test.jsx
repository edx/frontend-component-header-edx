/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';

import RefundPolicyNoticeSlot from './index';

jest.mock('@openedx/frontend-plugin-framework', () => ({
  PluginSlot: ({ id }) => <div data-testid="plugin-slot" data-slot-id={id} />,
}));

describe('<RefundPolicyNoticeSlot />', () => {
  it('renders the refund_policy_notice_slot plugin slot', () => {
    render(<RefundPolicyNoticeSlot />);

    expect(screen.getByTestId('plugin-slot')).toHaveAttribute('data-slot-id', 'refund_policy_notice_slot');
  });
});
