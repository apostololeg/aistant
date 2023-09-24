import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import type { Module } from '..';
import Icon from './IndentDecrease.svg';

export default {
  name: 'indent-decrease',
  hotkey: 'BracketLeft',
  action({ editor, selection }) {
    const { index, length } = selection;

    editor.formatLine(index, length, 'indent', '-1');
  },
  Module({ className, action, format }) {
    return (
      <Button
        className={className}
        onClick={action}
        disabled={!format?.indent}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
} as Module;
