import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';

import Icon from './Bold.svg';

export default {
  name: 'bold',
  hotkey: 'KeyB',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    editor.formatText(index, length, 'bold', !format.bold);
  },
  Module({ className, format, action }) {
    return (
      <Button
        className={className}
        onClick={action}
        checked={format.bold}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
