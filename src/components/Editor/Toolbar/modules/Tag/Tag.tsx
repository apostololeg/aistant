import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import type { Module } from '..';
import Icon from './Link.svg';

export default {
  name: 'tag',
  hotkey: 'Slash',
  action({ editor, selection }) {
    const { index, length } = selection;

    editor.insertEmbed(index, 'component', {
      component: 'Tag',
    });
  },
  Module({ className, selection, action }) {
    return null;
  },
} as Module;
