# Draft.js Clear Formatting

This package is a helper function for Draft JS users. It allows you toclear formatting in selected text in your app. You can choose to remove the following edits:
- Inline styles(bold, italic, underline)
- Entities(images, links etc.)
- Lists(orders, unorderes)

For more details checks configuration section below

## Usage
```sh
npm i --save draft-js-clear-formatting
```

then import the function

```js
import clearFormatting from 'draft-js-clear-formatting'
import Editor from 'draft-js-plugins-editor'

const newEditorState = clearFormatting(editorState, options)

```

## Options object

You can pass options object to the function. This object is not required. By default all options set to true.
```js
const options = {
  inline: true,
  entities: true,
  lists: true,
}
```

 Option   | Description                        | Default value |
| -------- | ---------------------------------- | ------------- |
| inline   | If true, removes all inline styles | true          |
| entities | If true, removes all entities      | true          |
| lists    | If true, removes all lists         | true          |

## TO DO
[] Add tests