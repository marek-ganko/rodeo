/**
 *
 * Modals work on a stack.  A modal that triggers another modal is stacking on top, such that cancelling the top modal
 * returns to the first.
 * @module
 */

import _ from 'lodash';
import Immutable from 'seamless-immutable';
import immutableUtil from '../../services/immutable-util';
import mapReducers from '../../services/map-reducers';
import reduxUtil from '../../services/redux-util';
import preferencesViewerReducer from '../preferences-viewer/preferences-viewer.reducer';
import types from './dialog-types';

function getInitialState() {
  return Immutable({items: []});
}

/**
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function add(state, action) {
  return immutableUtil.pushAtPath(state, ['items'], types.getDefault(action.payload.contentType));
}

/**
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function cancel(state, action) {
  const id = action.payload.id,
    targetIndex = _.findIndex(state, {id});

  if (targetIndex > -1) {
    state = immutableUtil.removeAtPath(state, ['items'], targetIndex);
  }

  return state;
}

/**
 * @returns {object}
 */
function cancelAll() {
  return getInitialState();
}

/**
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function ok(state, action) {
  // nothing special at the moment
  return cancel(state, action);
}

export default reduxUtil.reduceReducers(
  mapReducers({
    ADD_MODAL_DIALOG: add,
    CANCEL_MODAL_DIALOG: cancel,
    CANCEL_ALL_MODAL_DIALOGS: cancelAll,
    OK_MODAL_DIALOG: ok
  }, getInitialState()),
  reduxUtil.dialogReducer('preferences', preferencesViewerReducer)
);
