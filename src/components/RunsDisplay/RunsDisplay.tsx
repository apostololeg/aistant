import { withStore } from 'justorm/react';
import { Run } from 'types/run';
import cn from 'classnames';

import S from './RunsDisplay.styl';

export default withStore({
  runs: ['byId'],
})(function RunsDisplay({ store }) {
  const { byId } = store.runs;
  const items = Object.values(byId);

  if (!items.length) return null;

  return (
    <div className={S.root}>
      {items.map((run: Run) => {
        const { id, initiatorNodeId, completedIds, queue, isComplete } = run;

        return (
          <div className={cn(S.run, isComplete && S.complete)} key={run.id}>
            <div>id: {id}</div>
            <div>initiatorId: {initiatorNodeId}</div>
            <div>completedIds: {completedIds.join(', ')}</div>
            <div>queue: {queue.join(', ')}</div>
          </div>
        );
      })}
    </div>
  );
});
