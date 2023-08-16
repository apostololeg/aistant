import { Router } from 'express';
import { createCompletion, loadModel } from 'gpt4all';

const router = Router();
// const MODEL_NAME = 'wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0';
const MODEL_NAME = 'llama2_7b_chat_uncensored.ggmlv3.q2_K';
// const MODEL_NAME = 'orca-mini-3b.ggmlv3.q4_0';
const MODEL_PATH = '/home/oleg/prj/aistant/models/';
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
