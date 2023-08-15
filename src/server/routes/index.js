import gpt from './gpt';
// import passport from './passport';

export default function (app) {
  // passport(app);
  app.use('/api/gpt', gpt);
  // console.log('routes');
}
