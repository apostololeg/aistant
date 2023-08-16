import { Router } from 'express';
import { createCompletion, loadModel } from 'gpt4all';

import { MODEL_PATH, MODEL_NAME } from 'config';

const router = Router();
const DEFAULT_OPTIONS = {
  verbose: true,
};

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
