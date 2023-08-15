import dotenv from 'dotenv';
import express from 'express';
// import multer from 'multer';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
// import { Readable } from 'stream';

import { createCompletion, loadModel } from 'gpt4all';

(async function runGPT() {
  // const ll = await loadModel('ggml-all-MiniLM-L6-v2-f16', { verbose: true });

  const ll = await loadModel('ggml-gpt4all-j-v1.3-groovy', {
    verbose: true,
    modelPath: '/Users/olehapostol/prj/aistant/models/',
  });

  console.log('ll', ll);

  // const response = await createCompletion(ll, [
  //   { role: 'system', content: 'You are meant to be annoying and unhelpful.' },
  //   { role: 'user', content: 'What is 1 + 1?' },
  // ]);

  // console.log('GPT:', response);
})();

const envs = dotenv.config().parsed;

const app = express();
const PORT = process.env.PORT || envs.PORT;
// const upload = multer({ storage: multer.memoryStorage() });

const apiByKey = new Map();

const api = key =>
  apiByKey.get(key) ||
  apiByKey.set(key, new OpenAIApi(new Configuration({ apiKey: key }))).get(key);

app.use(cors());
app.use(express.json());

// app.post('/api/whisper', upload.single('audio'), async (req, res) => {
//   try {
//     // const data = Object.fromEntries(await .formData());
//     // const fileStream = Readable.from(Buffer.from(req.body.audio));
//     // req.body.audio to Readable stream
//     // const fileStream = Readable.from(req.body.audio);
//     const audioBuffer = req.file.buffer;
//     const fileStream = new Readable({
//       read() {
//         this.push(audioBuffer);
//         this.push(null);
//       },
//     });

//     // @ts-expect-error Workaround till OpenAI fixed the sdk
//     fileStream.path = 'audio.webm';
//     const resp = await openai.createTranscription(fileStream, 'whisper-1');

//     res.json(resp);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

app.post('/api/gpt', async (req, res) => {
  try {
    const { apiKey, ...params } = req.body;
    const completion = await api(apiKey).createChatCompletion(params);
    const { choices, usage } = completion.data;

    res.json({
      answer: choices[0].message,
      tokens: usage.total_tokens,
    });
  } catch (error) {
    console.log('Error::', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
