import { useEffect, useState } from 'react';
import cn from 'classnames';
import { Button, Icon } from 'uilib';

import { SpeechToText } from 'services/SpeechToText';

import S from './RequestButton.styl';

let stt;

export default function RequestButton({ onResult, onComplete }) {
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

  const toggle = () => {
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
}
