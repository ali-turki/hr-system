module.exports = {
  DB_NAME: 'hr-system',
  DB_HOST: 'mongodb://localhost',
  PORT: process.env.PORT || 3000,
  ENV: process.env.NODE_ENV || 'development'
}