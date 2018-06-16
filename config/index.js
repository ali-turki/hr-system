module.exports = {
  DB: {
    NAME: 'hr-system',
    HOST: 'mongodb://localhost',
  },
  ENV: {
    PORT: process.env.PORT || 3000,
    MODE: process.env.NODE_ENV || 'development'  
  },
  USER: {
    DEFAULT_PASSWORD: '123456789'
  },
  BYCRPT: {
    SALT_ROUNDS: 10
  },
  JWT: {
    SECRET: 'egypt2030' // should be more comolecated on production.
  }
};