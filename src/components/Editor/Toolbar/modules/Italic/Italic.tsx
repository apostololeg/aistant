import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import type { Module } from '..';
import Icon from './Italic.svg';

export default {
  name: 'italic',
  hotkey: 'KeyI',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    editor.formatText(index, length, 'italic', !format.italic);
  },
  Module({ className, format, action }) {
    return (
      <Button
        className={className}
        onClick={action}
        checked={format.italic}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
} as Module;
