import { useMemo } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import { AssistiveText, Input, Button, Icon } from '@homecode/ui';

import { i18n } from 'tools/i18n';
import RequestButton from 'components/RequestButton/RequestButton';

import S from './Prompt.styl';
import Editor from 'components/Editor/Editor';

export default withStore({
  dialogue: ['error', 'prompt', 'isPrompting'],
})(function Prompt({ onSubmit, store: { dialogue } }) {
  const { error, prompt, isPrompting } = dialogue;

  const onTyping = val => dialogue.setPrompt(val);
  const onTransciption = txt => dialogue.setPrompt(txt);

  const onKeyUp = e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || e.shiftKey)) {
      onSubmit(e);
    }
  };

  const buttons = useMemo(() => {
    if (isPrompting) {
      return (
        <Button variant="clear">
          <Icon type="loader" />
        </Button>
      );
    }
    return (
      <>
        <RequestButton onResult={onTransciption} onComplete={onSubmit} />
        <Button variant="clear" type="submit">
          <Icon size="l" type="send" />
        </Button>
      </>
    );
  }, [isPrompting, onTransciption, onsubmit]);

  return (
    <div className={cn(S.root, error && S.error)} onKeyUp={onKeyUp}>
      <Editor
        className={S.input}
        // size="l"
        // type="textarea"
        // placeholder="Ask me..."
        onChange={onTyping}
        // addonRight={<div className={S.buttonsPlaceholder} />}
        // onKeyUp={onKeyUp}
        value={prompt}
        // hasClear
      />
      <div className={S.buttons}>{buttons}</div>
    </div>
  );
});
