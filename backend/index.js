const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6360336803:AAGv1sekp9mqqKNxmbtAo4EQavDIPKcNup0');

const db = require('./db')
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json())

function sendNotification(users, course) {
  const message = `🎉<i>Новый курс</i>: <b>${course.name}</b>\n\n🏛️<i>Университет</i>: <b>${course.university}</b>\n\n🎓<i>Курс</i>: <b>${course.course}</b>\n\n📰<i>Описание</i>: <b>${course.description}</b>\n\n🫵🏻<u><i>Присоединяйся и поделись с друзьями.</i></u>`
             
  users.forEach(user => {
    if (user.university === course.university || user.subjects.includes(course.subjects[0]))
    {
      bot.sendMessage(user.id, message, { parse_mode: 'HTML' }).catch(e => console.log(e));
    }
  });
}

app.get('/', (req, res) => {
  db.getCourses()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/course', async (req, res) => {
  db.createCourse(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })

  const course = req.body;
  if (!course.is_draft) {
    const users = await db.getSubscribedUsers();
    sendNotification(users, course);
  }

})

app.post('/createuser', (req, res) => {
  db.createUser(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/sf', (req, res) => {
  db.sendFeedback(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.get('/user', (req, res) => {
  const { id } = req.query;

  db.getUser(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.get('/getcourse', (req, res) => {
  const { id } = req.query;

  db.getCourse(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
}) 

app.get('/usercourse', (req, res) => {
  const { id } = req.query;

  db.getUserCourses(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/update-bio', (req, res) => {
  db.updateBio(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/update-univ', (req, res) => {
  db.updateUniv(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/update-course', (req, res) => {
  db.updateCourse(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/update-subjects', (req, res) => {
  db.updateSubjects(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/update-pn', (req, res) => {
  db.updatePN(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/update-user', (req, res) => {
  db.updateUser(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/edit-course', (req, res) => {
  db.editCourse(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.delete('/delete-course', (req, res) => {
  db.delCourse(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.get('/user-paid-courses', (req, res) => {
  const { id } = req.query;

  db.userPaidCoursesId(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.get('/user-made-courses', (req, res) => {
  const { id } = req.query;

  db.userMadeCoursesId(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/success-payment', (req, res) => {
  db.successPayment(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.get('/user-paid-courses-full', (req, res) => {
  const { id } = req.query;

  db.userPaidCoursesFull(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.get('/user-selled-courses-full', (req, res) => {
  const { id } = req.query;

  db.userSelledCoursesFull(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})

app.post('/get-courses-by-ids', (req, res) => {
  db.getCoursesByIds(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
    console.log(error)
  })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
