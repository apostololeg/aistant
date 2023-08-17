import { Router } from 'express';
import { createCompletion, loadModel } from 'gpt4all';

import cfg from './../../../config/const';

const { MODEL_PATH, MODEL_NAME } = cfg;
const router = Router();
const DEFAULT_OPTIONS = {
  verbose: true,
};

const models = {};

let ll;
const init = (async function () {
  ll = await loadModel(MODEL_NAME, {
    verbose: true,
    modelPath: MODEL_PATH,
    // modelPath: '/home/oleg/prj/aistant/models/',
  });
})();

const awaitInitMiddlware = async (req, res, next) => {
  await init;
  next();
};

router.post('/prompt', awaitInitMiddlware, async (req, res) => {
  const { messages, options } = req.body;
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const response = await createCompletion(ll, messages, opts);

  res.json(response);
});

export default router;
