import cn from 'classnames';
import {
  LS,
  Input,
  Button,
  AssistiveText,
  Icon,
  Scroll,
  Router,
  Route,
  LightBox,
} from '@homecode/ui';
import { createStore, withStore } from 'justorm/react';

import { DateTime } from '@homecode/ui';
import Settings, { SettingsStore } from 'components/Settings/Settings';
import Prompt from 'components/Prompt/Prompt';
import { Token } from 'components/Token/Token';
import ws from 'stores/ws';

import S from './Dialogue.styl';
import { useEffect, useRef } from 'react';

type Props = {
  store?: any;
  question: string;
};

enum Role {
  User = 'user',
  Assistant = 'assistant',
}

type Message = {
  role: Role;
  content: string;
  duration?: number;
};

// const initialMessages: Message[] = [];
// @ts-ignore
const initialMessages: Message[] = LS.get('messages') || [];

const STORE = createStore('dialogue', {
  messages: initialMessages,
  usedTokens: LS.get('usedTokens') || 0,

  prompt: LS.get('prompt') || '',
  error: '',
  isPrompting: false,

  setPrompt(prompt: string) {
    this.prompt = prompt;
    LS.set('prompt', prompt);
  },

  setError(error: string) {
    this.error = error;
  },

  addMessage(role: Role, content: string, duration?: number) {
    this.messages.push({ role, content, duration });
    LS.set('messages', this.messages);
  },

  changeModel(model: string) {
    this.model = model;
    LS.set('model', model);
  },

  async ask(prompt: string = this.prompt) {
    if (!prompt || this.isPrompting) return;

    this.addMessage(Role.User, prompt);
    this.setPrompt('');
    this.setError('');
    this.isPrompting = true;

    try {
      const startedAt = Date.now();
      const modelName = SettingsStore.model;

      ws.socket.emit(
        'prompt',
        JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ], // save tokens
          // options: { temp: .5, verbose: true }
          modelName,
        })
      );

      // const response = await fetch(`${BAKCEND_DOMAIN}/api/core/completition`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     messages: this.messages.slice(-5), // save tokens
      //     // options: { temp: .5 }
      //     modelName,
      //   }),
      // });
      const duration = Date.now() - startedAt;

      const { choices, usage } = await response.json();
      const tokens = usage.total_tokens;

      if (response.status !== 200) {
        this.setError('Something went wrong');
        return;
      }

      this.usedTokens += tokens;
      LS.set('usedTokens', this.usedTokens);
      const { role, content } = choices[0].message;

      this.addMessage(role as Role, content, duration);

      SettingsStore.loadedModels[modelName] = true;

      const { autoPronounce, voiceLang, voiceName } = SettingsStore;

      if (autoPronounce && voiceName) {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = voiceLang;
        speechSynthesis.speak(utterance);
      }
    } finally {
      this.isPrompting = false;
    }
  },

  clearHistory() {
    this.messages = [];
    LS.set('messages', this.messages);
  },
});

export default withStore([
  'dialogue',
  {
    router: 'path',
    settings: 'updater',
  },
])(function Dialogue({
  store: {
    dialogue: { messages, usedTokens },
    settings: { updater },
    router,
  },
}: Props) {
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
            onClick={STORE.clearHistory}
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

      <Prompt />

      <Router>
        <Route path="/settings" component={() => null} />
      </Router>

      <LightBox isOpen={path === '/settings'} onClose={router.back} blur>
        <Settings onClearHistory={STORE.clearHistory} />
      </LightBox>
    </div>
  );
});
