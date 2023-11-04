export type Meta = {
  id: number;
  createdAt: string;
  updatedAt: string;
  node: number;
  data: string;
};

export enum NodeType {
  Text,
  Table,
  Function,
  View,
  Group,
}

export const NODE_TYPES = {
  Text: 'Text',
  Table: 'Table',
  Function: 'Function',
  View: 'View',
  Group: 'Group',
};

export type Node = {
  id: number;
  createdAt: string;
  updatedAt: string;
  meta: Meta[];
  type: NodeType;
  name: string;
  data: string;
  output: number[];
};
