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

import Settings, { SettingsStore } from 'components/Settings/Settings';

import S from './Dialogue.styl';
import { useEffect, useRef } from 'react';
import Prompt from 'components/Prompt/Prompt';
import { Token } from 'components/Token/Token';

type Props = {
  store?: any;
  question: string;
};

enum Role {
  User = 'user',
  Assistant = 'assistant',
}

type Message = { role: Role; content: string };

// const initialMessages: Message[] = [];
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

  addMessage(role: Role, content) {
    this.messages.push({ role, content });
    LS.set('messages', this.messages);
  },

  changeModel(model: string) {
    this.model = model;
    LS.set('model', model);
  },

  async ask(prompt: string = this.prompt) {
    const { apiKey } = SettingsStore;

    if (!prompt || this.isPrompting || !apiKey) return;

    this.addMessage(Role.User, prompt);
    this.setPrompt('');
    this.setError('');
    this.isPrompting = true;

    try {
      const response = await fetch(`/api/gpt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model: SettingsStore.model,
          messages: this.messages.slice(-5), // save tokens
        }),
      });

      const { answer, tokens } = await response.json();

      if (response.status !== 200) {
        this.setError('Something went wrong');
        return;
      }

      this.usedTokens += tokens;
      LS.set('usedTokens', this.usedTokens);

      this.addMessage(Role.Assistant, answer.content);

      const { autoPronounce, voiceLang, voiceName } = SettingsStore;

      if (autoPronounce && voiceName) {
        const utterance = new SpeechSynthesisUtterance(answer.content);
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
        <Button
          variant="clear"
          onClick={() => router.go('/settings')}
          className={cn(updater && S.hasUpdates)}
        >
          <Icon size="l" type="gear" />
        </Button>
      </div>
      <Scroll
        y
        // className={S.messages}
        offset={{ y: { before: 70, after: 100 } }}
        ref={listRef}
      >
        {messages.map(({ role, content }) => (
          <div key={content} className={cn(S.message, S[role])}>
            {content}
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
