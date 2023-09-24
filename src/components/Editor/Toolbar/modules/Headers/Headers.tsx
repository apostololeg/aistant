import { useCallback, useMemo } from 'react';
import { Select } from '@homecode/ui';
import cn from 'classnames';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import type { Module } from '..';
import icons from './icons';
import S from './Headers.styl';

const OPTIONS = [
  { id: 'h1', label: 'H1' },
  { id: 'h2', label: 'H2' },
  { id: 'h3', label: 'H3' },
];

function getValue(format) {
  if (!format) return null;
  return OPTIONS[format - 1].id;
}

export default {
  name: 'headers',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    editor.formatText(index, length, 'bold', !format.bold);
  },
  Module({ className, editor, format, selection }) {
    const currFormat = format?.header;
    const onChange = useCallback(
      val => {
        if (!selection) return;
        const { index, length } = selection;
        const newVal = val === getValue(currFormat) ? false : val;

        editor.removeFormat(index, length);
        editor.formatLine(index, length, 'header', newVal);
      },
      [currFormat, selection]
    );

    const val = useMemo(() => getValue(currFormat), [currFormat]);
    const icon = icons[val] || icons.h1;

    return (
      <Select
        className={cn(S.root, className)}
        options={OPTIONS}
        label="Header"
        popupProps={{ horizontal: 'left' }}
        menuProps={{ highlighted: true, padded: true }}
        value={val || ' '}
        onChange={onChange}
        renderLabel={() => <SvgIcon icon={icon} size={20} />}
      />
    );
  },
} as Module;
