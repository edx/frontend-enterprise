import React, { useMemo } from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { breakpoints, ResponsiveContext } from '@openedx/paragon';
import { SEARCH_FACET_FILTERS } from '../data/constants';

import { renderWithSearchContext } from './utils';

import '../../__mocks__/react-instantsearch-dom';
import SearchFilters from '../SearchFilters';
import SearchData from '../SearchContext';

const SearchContextWrapper = () => {
  const contextValue = useMemo(() => ({ width: breakpoints.large.maxWidth }), []);
  return (
    <ResponsiveContext.Provider value={contextValue}>
      <SearchFilters />
    </ResponsiveContext.Provider>
  );
};

describe('<SearchFilters />', () => {
  test('renders with a label', () => {
    renderWithSearchContext(<SearchContextWrapper />);
    SEARCH_FACET_FILTERS.forEach((filter) => {
      expect(screen.getByText(filter.title)).toBeInTheDocument();
    });
  });

  test('renders facets flagged isEndOfRow after the main facets', () => {
    const customFacets = [
      { attribute: 'main_attr', title: 'MainFacet' },
      { attribute: 'end_attr', title: 'EndFacet', isEndOfRow: true },
    ];
    const contextValue = { width: breakpoints.large.maxWidth };
    renderWithRouter(
      <IntlProvider locale="en">
        <ResponsiveContext.Provider value={contextValue}>
          <SearchData searchFacetFilters={customFacets}>
            <SearchFilters />
          </SearchData>
        </ResponsiveContext.Provider>
      </IntlProvider>,
    );
    const mainFacet = screen.getByText('MainFacet');
    const endFacet = screen.getByText('EndFacet');
    expect(mainFacet).toBeInTheDocument();
    expect(endFacet).toBeInTheDocument();
    // eslint-disable-next-line no-bitwise
    expect(mainFacet.compareDocumentPosition(endFacet) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
