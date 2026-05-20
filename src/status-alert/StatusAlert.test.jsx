import React from 'react';
import { render, screen } from '@testing-library/react';

import StatusAlert from './StatusAlert';

describe('StatusAlert', () => {
  it('renders the message text', () => {
    render(<StatusAlert message="System maintenance in progress" />);
    expect(screen.getByText('System maintenance in progress')).toBeVisible();
  });

  it('renders the warning icon', () => {
    const { container } = render(<StatusAlert message="System maintenance in progress" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
