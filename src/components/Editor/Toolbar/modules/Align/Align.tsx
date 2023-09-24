import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import icons from './icons';

function getValue(format) {
  if (!format.align) return 'center';
  if (format.align === 'center') return 'right';
  return false;
}

export default {
  name: 'align',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    editor.formatLine(index, length, 'align', getValue(format));
  },
  Module({ className, format, action }) {
    const icon = icons[format.align] || icons.left;

    return (
      <Button className={className} onClick={action} size="m" square>
        <SvgIcon icon={icon} size={20} />
      </Button>
    );
  },
};
