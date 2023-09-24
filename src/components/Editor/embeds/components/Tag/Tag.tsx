import { useMemo } from 'react';
import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';

type Props = {
  nodeId?: string;
  store?: any;
};

export const Tag = withStore('nodes')(function Tag({ nodeId, store }: Props) {
  const nodes = [...store.nodes.nodes.originalObject.values()];
  const allNodesOptoins = useMemo(
    () => nodes.map(n => ({ value: n.id, label: n.name })),
    [nodes]
  );
  const onChange = (value: any) => {
    console.log('onChange', value);
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
