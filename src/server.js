import dotenv from 'dotenv';

import express from 'express';
// import multer from 'multer';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
// import { Readable } from 'stream';

const { OPENAI_API_KEY } = dotenv.config().parsed;
const app = express();
const PORT = process.env.PORT || 4000;
// const upload = multer({ storage: multer.memoryStorage() });

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

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
    console.log(req.body);
    const completion = await openai.createChatCompletion(req.body);
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
