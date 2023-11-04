import { memo, useMemo } from 'react';
import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';

import S from './NodesSelector.styl';

type Props = {
  store?: any;
  popupProps?: any;
  inputProps?: any;
  value?: any;
  onChange?: (nodeId: string) => void;
};

const ACTIONS = {
  NEW_NODE: 'new_node',
};

export const NodesSelector = withStore({
  nodes: ['byId'],
})(function NodesSelector({
  store,
  popupProps,
  inputProps,
  value,
  onChange,
  ...props
}: Props) {
  const { ids, byId } = store.nodes;

  const allNodesOptoins = useMemo(() => {
    const nodesOpts = ids.map(id => ({
      id,
      label: byId[id].name,
    }));
    const actionsOptions = [{ id: ACTIONS.NEW_NODE, label: 'New node' }];

    return [...nodesOpts, ...actionsOptions];
  }, [byId]);

  const handleChange = async (nodeId: any) => {
    if (nodeId === ACTIONS.NEW_NODE) {
      await store.nodes.createNode({ name: nodeId });
    }

    onChange?.(nodeId);
  };

  console.log('NodesSelector', value, allNodesOptoins);

  return (
    <Select
      className={S.root}
      size="s"
      isSearchable
      options={allNodesOptoins}
      optionClassName={S.option}
      popupProps={{ direction: 'top', ...popupProps }}
      inputProps={{
        type: 'textarea',
        placeholder: 'type node name...',
        className: S.input,
        controlProps: { autoFocus: true },
        ...inputProps,
      }}
      required
      hideRequiredStar
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
});
