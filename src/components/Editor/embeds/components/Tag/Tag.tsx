import { useRef } from 'react';

import { NodesSelector } from 'components/NodesSelector/NodesSelector';
import { updateProps } from '../../helpers';

type Props = {
  nodeId: string;
  onChange?: (nodeId: string) => void;
};

export function Tag({ nodeId, onChange, ...props }: Props) {
  const ref = useRef(null);

  // const onSelectRef = useCallback(select => {
  //   const input = select?.triggerInputRef.current.inputRef.current;
  //   console.log('onSelectRef', select, input);

  //   Time.after(300, () => input?.focus());
  // }, []);

  const handleChange = (value: any) => {
    updateProps(ref.current.rootElem.current, { nodeId: value });
    onChange?.(value);
  };

  // useEffect(() => {
  //   updateProps(ref.current.rootElem.current, { nodeId });
  // }, [value]);

  // useEffect(() => {
  //   // @ts-ignore
  //   editor?.selection?.getRange()[1].native?.collapse();
  // }, []);

  return (
    <NodesSelector
      {...props}
      className="AAAAAAAAAAAA"
      popupProps={{ ref }}
      onChange={handleChange}
      value={nodeId ? parseInt(nodeId, 10) : null}
    />
  );
}
