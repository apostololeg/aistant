type Props = {
  onData?: (audioBlob: Blob) => void;
  onStop?: (audioBlob: Blob) => void;
};

export class VoiceRecorder {
  public props: Props;

  private isRecording: boolean;
  private mediaRecorder: MediaRecorder | null;
  private chunks: Blob[];
  private silenceTimer: NodeJS.Timeout | null;

  constructor(props: Props) {
    this.props = props;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.chunks = [];
    this.silenceTimer = null;

    this.init();
  }

  public async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = this.handleDataAvailable;
      recorder.onstop = this.handleStop;
      this.mediaRecorder = recorder;
    } catch (error) {
      console.error('Error starting VoiceRecorder:', error);
    }
  }

  private handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      this.chunks.push(event.data);
      this.props.onData?.(event.data);

      clearTimeout(this.silenceTimer!);
      this.silenceTimer = setTimeout(this.stopRecording, 2000);
    }
  };

  private handleStop = () => {
    const audioBlob = new Blob(this.chunks, { type: 'audio/wav' });
    this.props.onStop(audioBlob);
    this.chunks = [];
  };

  public start = () => {
    if (!this.mediaRecorder) return;

    this.isRecording = true;
    this.mediaRecorder.start(100);
    this.silenceTimer = setTimeout(this.stopRecording, 2000);
  };

  public stop = () => {
    this.stopRecording();
    this.isRecording = false;
  };

  public toggle = () => {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  };

  private stopRecording = () => {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      clearTimeout(this.silenceTimer!);
      this.silenceTimer = null;
    }
  };
}
