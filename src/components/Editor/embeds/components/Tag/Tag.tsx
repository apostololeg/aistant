import { useCallback, useEffect, useMemo, useRef } from 'react';
import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';
import Time from 'timen';

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

  // const onSelectRef = useCallback(select => {
  //   const input = select?.triggerInputRef.current.inputRef.current;
  //   console.log('onSelectRef', select, input);

  //   Time.after(300, () => input?.focus());
  // }, []);

  const onChange = (nodeId: any) => {
    console.log('onChange', nodeId);

    if (nodeId === ACTIONS.NEW_NODE) {
      store.nodes.createNode({ name: nodeId });
      return;
    }

    updateProps(ref.current.rootElem.current, { nodeId });
  };

  // useEffect(() => {
  //   // @ts-ignore
  //   editor?.selection?.getRange()[1].native?.collapse();
  // }, []);

  return (
    <Select
      // ref={onSelectRef}
      className={S.root}
      size="s"
      isSearchable
      options={allNodesOptoins}
      value={nodeId}
      onChange={onChange}
      popupProps={{ ref, direction: 'top' }}
      inputProps={{
        type: 'textarea',
        placeholder: 'type node name...',
        className: S.input,
        controlProps: { autoFocus: true },
      }}
      required
      hideRequiredStar
    />
  );
});
