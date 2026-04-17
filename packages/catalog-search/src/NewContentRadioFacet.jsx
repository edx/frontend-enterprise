import React, { useContext } from 'react';
import classNames from 'classnames';
import { Dropdown, Input } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { SearchContext } from './SearchContext';
import { SEARCH_EVENT_NAME_PREFIX } from './SearchBox';
import { setRefinementAction, deleteRefinementAction } from './data/actions';
import {
  NEW_CONTENT_REFINEMENT,
  NEW_CONTENT_SELECTED_EVENT,
} from './data/constants';

const NewContentRadioFacet = () => {
  const { refinements, dispatch, trackingName } = useContext(SearchContext);
  const isNewContentSelected = !!refinements[NEW_CONTENT_REFINEMENT];

  const handleSelect = (enabled) => {
    if (enabled) {
      dispatch(setRefinementAction(NEW_CONTENT_REFINEMENT, 1));
    } else {
      dispatch(deleteRefinementAction(NEW_CONTENT_REFINEMENT));
    }
    if (trackingName) {
      sendTrackEvent(
        `${SEARCH_EVENT_NAME_PREFIX}.${trackingName}.${NEW_CONTENT_SELECTED_EVENT}`,
        { newContent: enabled ? 'yes' : 'no' },
      );
    }
  };

  return (
    <div className="facet-list">
      <Dropdown className={classNames('mb-0 mr-md-3')}>
        <Dropdown.Toggle
          id="new-content-toggle"
          variant="inverse-primary"
          className={classNames({ 'font-weight-bold': isNewContentSelected })}
        >
          <FormattedMessage
            id="search.facetFilters.newContent.title"
            defaultMessage="New content"
            description="Title for the new content facet filter"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as="label" className="mb-0 py-3 d-flex align-items-center">
            <Input
              type="radio"
              name="new-content"
              value="any"
              checked={!isNewContentSelected}
              className="facet-item position-relative mr-2 mb-2"
              onChange={() => handleSelect(false)}
              data-testid="new-content-any"
            />
            <span className="facet-item-label">
              <FormattedMessage
                id="search.facetFilters.newContent.any"
                defaultMessage="Any"
                description="Option to include all content regardless of release date"
              />
            </span>
          </Dropdown.Item>
          <Dropdown.Item as="label" className="mb-0 py-3 d-flex align-items-center">
            <Input
              type="radio"
              name="new-content"
              value="new-only"
              checked={isNewContentSelected}
              className="facet-item position-relative mr-2 mb-2"
              onChange={() => handleSelect(true)}
              data-testid="new-content-only"
            />
            <span className={classNames('facet-item-label', { 'is-refined': isNewContentSelected })}>
              <FormattedMessage
                id="search.facetFilters.newContent.newOnly"
                defaultMessage="New content only"
                description="Option to restrict results to courses whose earliest run started within the last 12 months"
              />
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default NewContentRadioFacet;
