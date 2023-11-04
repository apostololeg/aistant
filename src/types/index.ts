export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

export type Message = {
  role: Role;
  content: string;
  duration?: number;
};

export const EVENT_TYPES = {
  CONNECTED: 'connected',
  INIT: 'init',
  CREATE_NODE: 'create_node',
  UPDATE_NODE: 'update_node',
  RUN_NODE: 'run_node',
  RUN_UPDATED: 'run_updated',
  CREATE_WORKFLOW: 'create_workflow',
};
