import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import { SearchBoxBase, searchText, SEARCH_EVENT_NAME } from '../SearchBox';
import { renderWithSearchContext } from '../../utils/tests';

jest.mock('@edx/frontend-platform/analytics');

const TEST_QUERY = 'test query';

describe('<SearchBox />', () => {
  test('renders with a label', () => {
    renderWithSearchContext(<SearchBoxBase />);

    // assert the Paragon <SearchField /> component renders
    expect(screen.queryByRole('search')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).toBeInTheDocument();

    // assert our custom label for the input renders
    expect(screen.getByLabelText(searchText)).toBeInTheDocument();
  });

  test('renders with an initial value', () => {
    renderWithSearchContext(<SearchBoxBase defaultRefinement={TEST_QUERY} />);

    // assert the Paragon <SearchField /> component renders
    expect(screen.queryByRole('searchbox')).toHaveAttribute('value', TEST_QUERY);
  });

  test('handles submit and clear', () => {
    const { history } = renderWithSearchContext(<SearchBoxBase />);

    // fill in search input and submit the search
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: TEST_QUERY } });
    fireEvent.click(screen.getByText('submit search'));

    // assert url is updated with the query
    expect(history).toHaveLength(2);
    expect(history.location.search).toEqual('?q=test%20query');
    // check tracking is invoked
    expect(sendTrackEvent).toHaveBeenCalledWith(
      SEARCH_EVENT_NAME,
      { query: TEST_QUERY },
    );

    // clear the input
    fireEvent.click(screen.getByText('clear search'));

    // assert query no longer exists in url
    expect(history).toHaveLength(3);
    expect(history.location.search).toEqual('');
  });
});
