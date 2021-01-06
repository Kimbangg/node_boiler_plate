const express = require('express'); // express 모듈을 가져온다.
const app = express(); // express module을 만든다
const port = 5000;
const mongoose = require('mongoose');
mongoose
  .connect('mongodb+srv://Bang:ehd123@boilerplate.yr5lv.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected..'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
