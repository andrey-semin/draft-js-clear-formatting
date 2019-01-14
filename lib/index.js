'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _isSoftNewlineEvent = require('draft-js/lib/isSoftNewlineEvent');

var _isSoftNewlineEvent2 = _interopRequireDefault(_isSoftNewlineEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return {
    handleReturn: function handleReturn(event, editorState, _ref) {
      var setEditorState = _ref.setEditorState;

      if ((0, _isSoftNewlineEvent2.default)(event)) {
        setEditorState(_draftJs.RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }
      return 'not-handled';
    }
  };
};