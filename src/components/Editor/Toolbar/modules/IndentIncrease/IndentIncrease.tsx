import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import { MAX_INDENT } from '../../../PostRenderHelpers';
import type { Module } from '..';

import Icon from './IndentIncrease.svg';

export default {
  name: 'indent-increase',
  hotkey: 'BracketRight',
  action({ editor, selection }) {
    const { index, length } = selection;

    editor.formatLine(index, length, 'indent', '+1');
  },
  Module({ className, action, format }) {
    return (
      <Button
        className={className}
        onClick={action}
        disabled={format?.indent >= MAX_INDENT}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
} as Module;
