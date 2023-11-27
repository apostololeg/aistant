import type { Module } from '..';

export default {
  name: 'tag',
  hotkey: 'Slash',
  action({ editor, selection }) {
    const { index, length } = selection;
    const range = editor.selection.getRange()[1].native;

    // Drop the selection
    range.collapse();

    editor.insertEmbed(index, 'component', {
      component: 'Tag',
    });
  },
  Module({ className, selection, action }) {
    return null;
  },
} as Module;
