export type Run = {
  id: number;
  initiatorNodeId: number;
  createdAt: string;
  updatedAt: string;
  queue: number[];
  completedIds: number[];
  isComplete: boolean;
};
