import { useEffect, useState } from 'react';
import cn from 'classnames';
import { withStore } from 'justorm/react';
import { Button, Icon } from '@homecode/ui';

import { SpeechToText } from 'services/SpeechToText';

import S from './RequestButton.styl';

let stt;

export default withStore({
  settings: ['voiceLang'],
})(function RequestButton({
  onResult,
  onComplete,
  store: {
    settings: { voiceLang },
  },
}) {
  const [isListening, setIsListening] = useState(false);

  const onSilence = () => {
    stt.stop();
    setIsListening(false);
    onComplete();
  };

  useEffect(() => {
    stt = new SpeechToText({
      onResult,
      onSilence,
      continous: true,
      interimResults: true,
    });
  }, []);

  useEffect(() => {
    stt.setLang(voiceLang);
  }, [voiceLang]);

  const toggle = () => {
    speechSynthesis.cancel();
    stt.toggle();
    setIsListening(stt.inProgress);
  };

  return (
    <Button
      onClick={toggle}
      variant="clear"
      className={cn(isListening && S.isListening)}
    >
      <Icon size="l" type="mic" />
    </Button>
  );
});
