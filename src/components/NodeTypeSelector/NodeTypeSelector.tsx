import { Button, Icon, Popup } from '@homecode/ui';
import { useCallback, useMemo, useState } from 'react';

import S from './NodeTypeSelector.styl';
import { NODE_TYPES } from 'types/node';

const nodeTypes = Object.keys(NODE_TYPES);

console.log('nodeTypes', nodeTypes);

const ICON_BY_TYPE = {
  [NODE_TYPES.Text]: 'draft',
  [NODE_TYPES.Table]: 'table',
  [NODE_TYPES.Function]: 'function',
  [NODE_TYPES.View]: 'eye',
  [NODE_TYPES.Group]: 'group',
};

export default function NodeTypeSelector({ onChange, ...props }) {
  const [isOpen, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);
  const currType = props.value;

  return (
    <div className={S.root}>
      <Popup
        direction="bottom-right"
        // elevation={1}
        isOpen={isOpen}
        hoverControl
        focusControl
        blur
        trigger={
          <Button
            // variant="clear"
            size="s"
            onClick={toggle}
            className={S.button}
          >
            <Icon type={ICON_BY_TYPE[currType]} />
          </Button>
        }
        content={
          <>
            {nodeTypes.reduce((acc, type) => {
              if (type !== props.value) {
                acc.push(
                  <Button
                    size="s"
                    onClick={() => onChange(type)}
                    className={S.option}
                    key={type}
                  >
                    <Icon type={ICON_BY_TYPE[type]} />
                    <span className={S.text}>{type}</span>
                  </Button>
                );
              }

              return acc;
            }, [])}
          </>
        }
        {...props}
      />
    </div>
  );
}
