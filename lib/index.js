'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeLists = undefined;

var _draftJs = require('draft-js');

var styles = ['BOLD', 'ITALIC', 'UNDERLINE'];

var removeInlineStyles = function removeInlineStyles(editorState) {
  var contentState = editorState.getCurrentContent();
  var contentWithoutStyles = styles.reduce(function (acc, style) {
    return _draftJs.Modifier.removeInlineStyle(acc, editorState.getSelection(), style);
  }, contentState);

  var newEditorState = _draftJs.EditorState.push(editorState, contentWithoutStyles, 'change-inline-style');

  return newEditorState;
};

var removeEntities = function removeEntities(editorState) {
  var contentState = editorState.getCurrentContent();
  var contentWithoutEntities = _draftJs.Modifier.applyEntity(contentState, editorState.getSelection(), null);

  var newEditorState = _draftJs.EditorState.push(editorState, contentWithoutEntities, 'apply-entity');

  return newEditorState;
};

var removeLists = exports.removeLists = function removeLists(editorState) {
  var contentState = editorState.getCurrentContent();
  var contentWithoutLists = contentState;
  var newEditorState = editorState;
  var blocksMap = contentState.getBlockMap();

  blocksMap.forEach(function (block) {
    var blockType = block.getType();
    if (blockType === 'ordered-list-item' || blockType === 'unordered-list-item') {
      var selectionState = _draftJs.SelectionState.createEmpty(block.getKey());
      var updatedSelection = selectionState.merge({
        focusOffset: 0,
        anchorOffset: block.getText().length
      });

      contentWithoutLists = _draftJs.Modifier.setBlockType(contentWithoutLists, updatedSelection, 'unstyled');
    }
  });

  newEditorState = _draftJs.EditorState.push(newEditorState, contentWithoutLists, 'change-block-type');

  return newEditorState;
};

var makeHelpersArray = function makeHelpersArray(options) {
  var helpers = [];

  if (options.inline) {
    helpers.push(removeInlineStyles);
  }

  if (options.entities) {
    helpers.push(removeEntities);
  }

  if (options.lists) {
    helpers.push(removeLists);
  }

  return helpers;
};

var defaultOptions = {
  inline: true,
  entities: true,
  lists: true
};

exports.default = function (editorState) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var mergedOptions = Object.assign(defaultOptions, options);
  var helpers = makeHelpersArray(mergedOptions);
  var newEditorState = helpers.reduce(function (acc, helper) {
    return helper(acc);
  }, editorState);

  return newEditorState;
};