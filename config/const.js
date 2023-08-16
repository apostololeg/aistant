import dotenv from 'dotenv';

const { parsed: env } = dotenv.config();

env.PRODUCTION = process.env.NODE_ENV === 'production';

export default env;
