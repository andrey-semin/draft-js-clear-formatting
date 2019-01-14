import { Modifier, EditorState, SelectionState } from 'draft-js';

const styles = ['BOLD', 'ITALIC', 'UNDERLINE'];

const removeInlineStyles = editorState => {
  const contentState = editorState.getCurrentContent();
  const contentWithoutStyles = styles.reduce(
    (acc, style) =>
      Modifier.removeInlineStyle(acc, editorState.getSelection(), style),
    contentState
  );

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutStyles,
    'change-inline-style'
  );

  return newEditorState;
};

const removeEntities = editorState => {
  const contentState = editorState.getCurrentContent();
  const contentWithoutEntities = Modifier.applyEntity(
    contentState,
    editorState.getSelection(),
    null
  );

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutEntities,
    'apply-entity'
  );

  return newEditorState;
};

export const removeLists = editorState => {
  const contentState = editorState.getCurrentContent();
  let contentWithoutLists = contentState;
  let newEditorState = editorState;
  const blocksMap = contentState.getBlockMap();

  blocksMap.forEach(block => {
    const blockType = block.getType();
    if (
      blockType === 'ordered-list-item' ||
      blockType === 'unordered-list-item'
    ) {
      const selectionState = SelectionState.createEmpty(block.getKey());
      const updatedSelection = selectionState.merge({
        focusOffset: 0,
        anchorOffset: block.getText().length
      });

      contentWithoutLists = Modifier.setBlockType(
        contentWithoutLists,
        updatedSelection,
        'unstyled'
      );
    }
  });

  newEditorState = EditorState.push(
    newEditorState,
    contentWithoutLists,
    'change-block-type'
  );

  return newEditorState;
};

const makeHelpersArray = options => {
  const helpers = [];

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

const defaultOptions = {
  inline: true,
  entities: true,
  lists: true
};

export default (editorState, options) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const helpers = makeHelpersArray(mergedOptions);
  const newEditorState = helpers.reduce(
    (acc, helper) => helper(acc),
    editorState
  );

  return newEditorState;
};
