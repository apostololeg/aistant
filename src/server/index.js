import dotenv from 'dotenv';
import express from 'express';
// import multer from 'multer';
import cors from 'cors';
// import { Readable } from 'stream';
import routes from './routes';

const envs = dotenv.config().parsed;

const app = express();
const PORT = process.env.PORT || envs.PORT;
// const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
