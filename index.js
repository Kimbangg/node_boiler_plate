const express = require('express'); // express 모듈을 가져온다.
const app = express(); // express module을 만든다
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const config = require('./config/key');

//apllication/x-www-form-urlencoded => 분석해서 가져오는 것
app.use(bodyParser.urlencoded({ extended: true }));
// application/json => 분석해서 가져오는 것
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected..'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('이번 주까지 마무리!');
});

app.post('/register', (req, res) => {
  // 회원기입 시, 필요한 정보를 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
