import cn from 'classnames';
import {
  Button,
  AssistiveText,
  Icon,
  Scroll,
  Router,
  Route,
  LightBox,
} from '@homecode/ui';
import { createStore, withStore } from 'justorm/react';

import Settings, { SettingsStore } from 'components/Settings/Settings';
import { Token } from 'components/Token/Token';
import NodesEditor from 'components/NodesEditor/NodesEditor';

import S from './Dialogue.styl';
import { useEffect, useRef } from 'react';

type Props = {
  store?: any;
  question: string;
};

export default withStore([
  'dialogue',
  {
    router: 'path',
    settings: 'updater',
  },
])(function Dialogue({ store: { dialogue, settings, router } }: Props) {
  const { updater } = settings;
  const { messages, usedTokens } = dialogue;
  const { path } = router;

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom
    // @ts-ignore
    const inner = listRef.current.innerElem;
    inner.scrollTo(0, inner.scrollHeight, { behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={S.root}>
      <div className={S.header}>
        <Token value={usedTokens} />
        <div>
          <Button
            variant="clear"
            onClick={dialogue.clearHistory}
            title="Clear chat"
          >
            <Icon size="l" type="draft" />
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="clear"
            onClick={() => router.go('/settings')}
            className={cn(updater && S.hasUpdates)}
            title="Settings"
          >
            <Icon size="l" type="gear" />
          </Button>
        </div>
      </div>
      <Scroll
        y
        // className={S.messages}
        offset={{ y: { before: 70, after: 100 } }}
        // @ts-ignore
        // innerProps={{ ref: listRef }}
        ref={listRef}
      >
        {messages.map(({ role, content, duration }) => (
          <div key={content} className={cn(S.message, S[role])}>
            {content}
            {duration && (
              <AssistiveText className={S.duration}>
                {(duration / 1000).toFixed()} sec
              </AssistiveText>
            )}
          </div>
        ))}
      </Scroll>

      <Router>
        <Route path="/settings" component={() => null} />
      </Router>

      <LightBox isOpen={path === '/settings'} onClose={router.back} blur>
        <Settings onClearHistory={dialogue.clearHistory} />
      </LightBox>
    </div>
  );
});
