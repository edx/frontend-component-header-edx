import React from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import {
  fireEvent, initializeMockApp, render, screen,
} from '../setupTest';
import { LearningHeader as Header } from '../index';

describe('Header', () => {
  beforeAll(async () => {
    // We need to mock AuthService to implicitly use `getAuthenticatedUser` within `AppContext.Provider`.
    await initializeMockApp();
  });

  it('displays user button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { className: 'dropdown-toggle' })).toBeInTheDocument();
  });

  it('displays user menu in dropdown', () => {
    const authenticatedUser = {
      userId: 'abc123',
      username: 'edX',
      name: 'edX',
      email: 'test@example.com',
      roles: [],
      administrator: false,
    };
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    const component = (
      <AppContext.Provider
        value={contextValue}
      >
        <Header />
      </AppContext.Provider>
    );

    render(component);

    const button = screen.getByRole('button', { className: 'dropdown-toggle' });
    fireEvent.click(button);
    const userMenuItem = screen.queryByTestId('user-item');
    expect(userMenuItem).toBeInTheDocument();
  });

  it('displays course data', () => {
    const courseData = {
      courseOrg: 'course-org',
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };
    render(<Header {...courseData} />);

    expect(screen.getByText(`${courseData.courseOrg} ${courseData.courseNumber}`)).toBeInTheDocument();
    expect(screen.getByText(courseData.courseTitle)).toBeInTheDocument();
  });
});
