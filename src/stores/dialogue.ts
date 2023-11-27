import { createStore } from 'justorm/react';
import { LS } from '@homecode/ui';
import { SettingsStore } from 'components/Settings/Settings';
import { Role } from 'types';

import ws from './ws';

// const initialMessages: Message[] = [];
// @ts-ignore
const initialMessages: Message[] = LS.get('messages') || [];

export default createStore('dialogue', {
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

    this.setError('');
    this.isPrompting = true;

    try {
      const startedAt = Date.now();
      const modelName = SettingsStore.model;

      ws.socket.emit(
        'prompt',
        JSON.stringify({
          prompt,
          // options: { temp: .5, verbose: true }
          modelName,
        })
      );

      ws.socket.on('prompt', (data: any) => {
        // const { role, content } = JSON.parse(data);
        // this.addMessage(role as Role, content, Date.now() - startedAt);
      });

      // // const response = await fetch(`${BAKCEND_DOMAIN}/api/core/completition`, {
      // //   method: 'POST',
      // //   headers: { 'Content-Type': 'application/json' },
      // //   body: JSON.stringify({
      // //     messages: this.messages.slice(-5), // save tokens
      // //     // options: { temp: .5 }
      // //     modelName,
      // //   }),
      // // });
      // const duration = Date.now() - startedAt;

      // const { choices, usage } = await response.json();
      // const tokens = usage.total_tokens;

      // if (response.status !== 200) {
      //   this.setError('Something went wrong');
      //   return;
      // }

      // this.usedTokens += tokens;
      // LS.set('usedTokens', this.usedTokens);
      // const { role, content } = choices[0].message;

      // this.addMessage(role as Role, content, duration);

      // SettingsStore.loadedModels[modelName] = true;

      // const { autoPronounce, voiceLang, voiceName } = SettingsStore;

      // if (autoPronounce && voiceName) {
      //   const utterance = new SpeechSynthesisUtterance(content);
      //   utterance.lang = voiceLang;
      //   speechSynthesis.speak(utterance);
      // }
    } finally {
      this.isPrompting = false;
    }
  },

  clearHistory() {
    this.messages = [];
    LS.set('messages', this.messages);
  },
});
