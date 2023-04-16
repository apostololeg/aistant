import { withStore } from 'justorm/react';
import { AssistiveText, Input, Button, Icon } from 'uilib';

import RequestButton from 'components/RequestButton/RequestButton';

import S from './Prompt.styl';

export default withStore({
  dialogue: ['error', 'prompt'],
})(function Prompt({ store: { dialogue } }) {
  const { error, prompt } = dialogue;
  const onTyping = (e, val) => dialogue.setPrompt(val);
  const onTransciption = txt => dialogue.setPrompt(txt);

  const onRequest = () => dialogue.ask();
  const onSubmit = e => {
    speechSynthesis.cancel();
    e.preventDefault();
    dialogue.ask();
  };

  return (
    <form onSubmit={onSubmit} className={S.root}>
      {error && (
        <AssistiveText variant="danger" className={S.error}>
          {error}
        </AssistiveText>
      )}
      <Input
        className={S.input}
        size="l"
        type="textarea"
        placeholder="Ask me..."
        onChange={onTyping}
        addonRight={<div className={S.buttonsPlaceholder} />}
        value={prompt}
        // hasClear
      />
      <div className={S.buttons}>
        <RequestButton onResult={onTransciption} onComplete={onRequest} />
        <Button variant="clear" type="submit">
          <Icon size="l" type="send" />
        </Button>
      </div>
    </form>
  );
});
