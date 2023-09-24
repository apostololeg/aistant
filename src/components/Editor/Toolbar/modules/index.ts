// import Link from './Link/Link';
import Tag from './Tag/Tag';
import type Quill from 'components/Editor/Quill';

type Selection = {
  index: number;
  length: number;
};

type API = {
  editor: Quill;
  selection: Selection;
  format: any;
};

type Action = (props: API, moduleProps?: any) => void;

type ModuleProps = API & {
  className: string;
  // icon: string;
  action: Action;
};

export type Module = {
  name: string;
  hotkey?: string;
  action: Action;
  Module: (props: ModuleProps) => JSX.Element;
};

export default [Tag] as Module[];
