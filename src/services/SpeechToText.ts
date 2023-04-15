// import { VoiceRecorder } from 'services/VoiceRecorder';

const SILENCE_TIMEOUT = 2000;

type Props = {
  continous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string) => void;
  onSilence?: () => void;
};

export class SpeechToText {
  transcript = '';
  isRecording = false;
  inProgress = false;

  private props: Props;
  private api;
  // private recorder: VoiceRecorder;
  private silenceTimeout: NodeJS.Timer;

  constructor(props: Props) {
    this.props = props;

    if ('webkitSpeechRecognition' in window) {
      this.api = new webkitSpeechRecognition();
      this.api.continuous = props.continous ?? false;
      this.api.interimResults = props.interimResults ?? false;
      this.api.onresult = this.onResult;
      // } else {
      //   this.recorder = new VoiceRecorder({
      //     onStop: this.sendToWhisperAPI,
      //     // onData: chunk => {
      //     //   console.log('chunk', chunk);
      //     // },
      //   });
    }
  }

  start = () => {
    if (this.inProgress) return;

    this.api.start();
    this.inProgress = true;
  };

  stop = () => {
    if (!this.inProgress) return;

    this.api.stop();
    this.inProgress = false;
  };

  toggle = () => {
    if (this.inProgress) {
      this.stop();
    } else {
      this.start();
    }
  };

  onResult = e => {
    const { onResult, onSilence } = this.props;
    const transcript = e.results[0][0].transcript;

    clearTimeout(this.silenceTimeout);
    if (onSilence) this.silenceTimeout = setTimeout(onSilence, SILENCE_TIMEOUT);

    this.transcript = transcript;
    onResult(transcript);
  };

  // private sendToWhisperAPI = async audioBlob => {
  //   const formData = new FormData();
  //   const blob = new Blob(this.recorder.chunks, {
  //     type: 'audio/webm;codecs=opus',
  //   });
  //   // formData.append('file', audioBlob, 'audio.wav');
  //   formData.append('audio', blob, 'audio.webm');

  //   try {
  //     console.time('whisper-api-call');
  //     const response = await fetch('http://localhost:4000/api/whisper', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${OPENAI_API_KEY}`,
  //       },
  //       body: formData,
  //     });
  //     console.timeEnd('whisper-api-call');

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       this.transcript = data.data.text;
  //     } else {
  //       console.error('Error in Whisper API call:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error in Whisper API call:', error);
  //   }
  // };
}
