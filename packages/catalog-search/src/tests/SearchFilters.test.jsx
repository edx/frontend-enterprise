import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { renderWithRouter } from '@2uinc/frontend-enterprise-utils';
import { breakpoints, ResponsiveContext } from '@openedx/paragon';
import { SEARCH_FACET_FILTERS } from '../data/constants';

import { renderWithSearchContext } from './utils';

import '../../__mocks__/react-instantsearch-dom';
import SearchFilters from '../SearchFilters';
import SearchData from '../SearchContext';

const SearchContextWrapper = ({ filterComponents }) => {
  const contextValue = useMemo(() => ({ width: breakpoints.large.maxWidth }), []);
  return (
    <ResponsiveContext.Provider value={contextValue}>
      <SearchFilters filterComponents={filterComponents} />
    </ResponsiveContext.Provider>
  );
};
SearchContextWrapper.propTypes = {
  filterComponents: PropTypes.node,
};
SearchContextWrapper.defaultProps = {
  filterComponents: null,
};

describe('<SearchFilters />', () => {
  test('renders default facets when filterComponents is not provided', () => {
    renderWithSearchContext(<SearchContextWrapper />);
    SEARCH_FACET_FILTERS.forEach((filter) => {
      expect(screen.getByText(filter.title)).toBeInTheDocument();
    });
  });

  test('renders the provided filterComponents in place of the default facets', () => {
    const customComponents = [
      <div key="first">CustomFilterOne</div>,
      <div key="second">CustomFilterTwo</div>,
    ];
    const contextValue = { width: breakpoints.large.maxWidth };
    renderWithRouter(
      <IntlProvider locale="en">
        <ResponsiveContext.Provider value={contextValue}>
          <SearchData>
            <SearchFilters filterComponents={customComponents} />
          </SearchData>
        </ResponsiveContext.Provider>
      </IntlProvider>,
    );
    // Custom components render
    const first = screen.getByText('CustomFilterOne');
    const second = screen.getByText('CustomFilterTwo');
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
    // And in the order the consumer provided them
    // eslint-disable-next-line no-bitwise
    expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Default facets are suppressed when the override is provided
    SEARCH_FACET_FILTERS.forEach((filter) => {
      expect(screen.queryByText(filter.title)).not.toBeInTheDocument();
    });
  });
});
