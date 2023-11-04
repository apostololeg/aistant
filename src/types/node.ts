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
