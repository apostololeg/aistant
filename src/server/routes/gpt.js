import { Router } from 'express';
import fs from 'fs';
import { createCompletion, loadModel } from 'gpt4all';

import cfg from './../../../config/const';

const { MODEL_PATH } = cfg;
const router = Router();
const DEFAULT_OPTIONS = {
  verbose: true,
};

function getListOfFiles(directoryPath) {
  try {
    return fs.readdirSync(directoryPath).map(name => name.replace(/.bin$/, ''));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

const MODELS = getListOfFiles('./models');
const models = {};

const initModel = async (name, options = {}) => {
  const model = models[name];

  if (model?.loaded) return;

  if (model?.init) return model.init;

  const init = loadModel(name, { ...options, modelPath: MODEL_PATH });

  models[name] = {
    name,
    options,
    loaded: false,
    ll: null,
    init,
  };

  models[name].ll = await init;
  models[name].init = null;
  models[name].loaded = true;
  models[name].startedAt = new Date();
};

router
  .get('/state', async (req, res) => {
    const loaded = Object.keys(models).reduce((acc, name) => {
      const { options, startedAt } = models[name];
      acc[name] = { options, startedAt };
      return acc;
    }, {});

    res.json({ loaded, models: MODELS });
  })
  .post('/prompt', async (req, res) => {
    const { modelName, messages, options } = req.body;

    const opts = { ...DEFAULT_OPTIONS, ...options };
    let model = models[modelName];

    if (!model?.loaded) {
      await initModel(modelName, opts);
      model = models[modelName];
    }

    const response = await createCompletion(model.ll, messages, options);

    res.json(response);
  });

export default router;
