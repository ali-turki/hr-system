const router = require('express').Router();
const userRouter = require('./user.router');

router.get('/', (req, res) => {
  res.json({
    name: 'HR-SYSTEM',
    version: '1.0.0'
  });
});

router.use('/api/v1', userRouter);

module.exports = router;