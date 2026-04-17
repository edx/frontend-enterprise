import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import NewContentRadioFacet from '../NewContentRadioFacet';

import { renderWithSearchContext } from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}));

describe('<NewContentRadioFacet />', () => {
  test('renders with a label and is not bold initially', () => {
    renderWithSearchContext(<NewContentRadioFacet />);
    expect(screen.getByText('New content')).toBeInTheDocument();
    expect(screen.getByText('New content').classList.contains('font-weight-bold')).toBeFalsy();
  });

  test('shows both options when opened', async () => {
    const user = userEvent.setup();
    renderWithSearchContext(<NewContentRadioFacet />);
    await user.click(screen.getByText('New content'));
    await waitFor(() => {
      expect(screen.getByTestId('new-content-any')).toBeInTheDocument();
      expect(screen.getByTestId('new-content-only')).toBeInTheDocument();
    });
  });

  test('Any is checked by default', async () => {
    const user = userEvent.setup();
    renderWithSearchContext(<NewContentRadioFacet />);
    await user.click(screen.getByText('New content'));
    await waitFor(() => {
      expect(screen.getByTestId('new-content-any')).toBeChecked();
      expect(screen.getByTestId('new-content-only')).not.toBeChecked();
    });
  });

  test('selecting "New content only" marks the dropdown as refined', async () => {
    const user = userEvent.setup();
    renderWithSearchContext(<NewContentRadioFacet />);
    await user.click(screen.getByText('New content'));
    await user.click(screen.getByTestId('new-content-only'));
    await waitFor(() => {
      expect(screen.getByText('New content').classList.contains('font-weight-bold')).toBeTruthy();
      expect(screen.getByText('New content only').classList.contains('is-refined')).toBeTruthy();
      expect(screen.getByTestId('new-content-only')).toBeChecked();
    });
  });

  test('toggling back to Any clears the refinement', async () => {
    const user = userEvent.setup();
    renderWithSearchContext(<NewContentRadioFacet />);
    await user.click(screen.getByText('New content'));
    await user.click(screen.getByTestId('new-content-only'));
    await waitFor(() => {
      expect(screen.getByText('New content').classList.contains('font-weight-bold')).toBeTruthy();
    });
    // Dropdown auto-closes after a selection — reopen it to click the other option.
    await user.click(screen.getByText('New content'));
    await user.click(screen.getByTestId('new-content-any'));
    await waitFor(() => {
      expect(screen.getByText('New content').classList.contains('font-weight-bold')).toBeFalsy();
      expect(screen.getByTestId('new-content-any')).toBeChecked();
    });
  });
});
