import { useMemo, useRef } from 'react';
import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';

import { updateProps } from '../../helpers';
import S from './Tag.styl';

type Props = {
  nodeId?: string;
  store?: any;
};

const ACTIONS = {
  NEW_NODE: 'new_node',
};

export const Tag = withStore({ nodes: ['nodes'] })(function Tag({
  nodeId,
  store,
}: Props) {
  const nodes = [...store.nodes.items.originalObject];
  const ref = useRef(null);

  const allNodesOptoins = useMemo(() => {
    const nodesOptions = nodes.map(n => ({ id: n.id, label: n.name }));
    const actionsOptions = [{ id: ACTIONS.NEW_NODE, label: 'New node' }];

    return [...nodesOptions, ...actionsOptions];
  }, [nodes]);

  const onChange = (nodeId: any) => {
    console.log('onChange', nodeId);

    if (nodeId === ACTIONS.NEW_NODE) {
      store.nodes.createNode({ name: nodeId });
      return;
    }

    updateProps(ref.current.rootElem.current, { nodeId });
  };

  return (
    <Select
      className={S.root}
      size="s"
      isSearchable
      options={allNodesOptoins}
      value={nodeId}
      onChange={onChange}
      popupProps={{ ref }}
      inputProps={{ placeholder: 'type node name...' }}
      required
      hideRequiredStar
    />
  );
});
