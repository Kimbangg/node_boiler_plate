const express = require('express'); // express 모듈을 가져온다.
const app = express(); // express module을 만든다
const port = 5000;
const cookeParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

app.use(cookeParser());
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

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }
    // 요청한 이메일이 있다면 비밀번호가 같은지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' });
      }
    });
    // 비밀번호가 맞다면, 토큰을 생성하기.
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      // 토큰을 저장한다.
      res.cookie('x_auth', user.token).status(200).json({ loginSuccess: true, userId: user._id });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role == 0 ? false : true,
    isAuth: true,
    email: req.user.emaail,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
