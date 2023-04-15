import cn from 'classnames';
import { LS, Input, Button, Icon, Scroll } from 'uilib';
import { createStore, withStore } from 'justorm/react';

import RequestButton from 'components/RequestButton/RequestButton';

import S from './Dialogue.styl';

type Props = {
  store?: any;
  question: string;
};

enum Role {
  User = 'user',
  Assistant = 'assistant',
}

type Message = { role: Role; content: string };

const initialMessages: Message[] = [];
// const initialMessages = LS.get('messages') || [];

const STORE = createStore('dialogue', {
  messages: initialMessages,
  usedTokens: LS.get('usedTokens') || 0,

  prompt: '',
  isPrompting: false,

  addMessage(role: Role, content) {
    this.messages.push({ role, content });
    // LS.set('messages', this.messages);
  },

  async ask(prompt: string = this.prompt) {
    if (!prompt || this.isPrompting) return;

    console.log('ask::', prompt);

    this.addMessage(Role.User, prompt);
    this.isPrompting = true;
    this.prompt = '';

    try {
      const response = await fetch('http://localhost:4000/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: this.messages.slice(-5), // save tokens
        }),
      });
      const { answer, tokens } = await response.json();

      this.usedTokens += tokens;
      this.addMessage(Role.Assistant, answer.content);
    } finally {
      this.isPrompting = false;
    }
  },
});

export default withStore('dialogue')(function Dialogue({
  store: {
    dialogue: { prompt, messages, isPrompting },
  },
}: Props) {
  const onTyping = (e, val) => (STORE.prompt = val);
  const onTransciption = txt => (STORE.prompt = txt);

  const onRequest = () => STORE.ask();
  const onSubmit = e => {
    e.preventDefault();
    STORE.ask();
  };

  console.log('prompt', prompt);

  return (
    <div className={S.root}>
      <Scroll y className={S.messages} offset={{ y: { before: 20 } }}>
        {messages.map(({ role, content }) => (
          <div key={content} className={cn(S.message, S[role])}>
            {content}
          </div>
        ))}
      </Scroll>
      <form onSubmit={onSubmit} className={S.prompt}>
        <Input
          className={S.promptInput}
          size="l"
          type="textarea"
          placeholder="Type your question"
          onChange={onTyping}
          addonRight={<div className={S.promptButtonsPlaceholder} />}
          value={prompt}
          // hasClear
        />
        <div className={S.promptButtons}>
          <RequestButton onResult={onTransciption} onComplete={onRequest} />
          <Button variant="clear" type="submit">
            <Icon size="l" type="send" />
          </Button>
        </div>
      </form>
    </div>
  );
});
