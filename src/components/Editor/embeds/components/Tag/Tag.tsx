import { useMemo } from 'react';
import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';

type Props = {
  nodeId?: string;
  store?: any;
};

const ACTIONS = {
  NEW_NODE: 'new_node',
};

export const Tag = withStore('nodes')(function Tag({ nodeId, store }: Props) {
  const nodes = [...store.nodes.nodes.originalObject.values()];

  const allNodesOptoins = useMemo(() => {
    const nodesOptions = nodes.map(n => ({ id: n.id, label: n.name }));
    const actionsOptions = [{ id: ACTIONS.NEW_NODE, label: 'New node' }];

    return [...nodesOptions, ...actionsOptions];
  }, [nodes]);

  const onChange = (value: any) => {
    console.log('onChange', value);

    if (value === ACTIONS.NEW_NODE) {
      store.nodes.createNode();
      return;
    }
  };

  return (
    <Select
      size="m"
      isSearchable
      options={allNodesOptoins}
      onChange={onChange}
      popupProps={{ isOpen: true }}
      inputProps={{ placeholder: 'type node name...' }}
    />
  );
});
