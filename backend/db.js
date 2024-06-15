const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'cocourse',
  password: 'root',
  port: 5432,
});

async function getSubscribedUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE notify = true');
    return result.rows;
  } finally {
    client.release();
  }
}

const getCourses = () => {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM courses WHERE NOT is_draft', (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
}

const getUser = (id) => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getCourse = (id) => {
  return new Promise (function(resolve, reject) {
    pool.query('SELECT * FROM courses WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getUserCourses = (id) => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM courses WHERE "user" = $1 AND NOT is_draft', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const createUser = (body) => {
  return new Promise(function(resolve, reject) {
    const { id, first_name, last_name, username, photo_url, course, description, university, subjects, feedback } = body
    pool.query('INSERT INTO users (id, first_name, last_name, username, photo_url, course, description, university, subjects, feedback) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [id, first_name, last_name, username, photo_url, course, description, university, subjects, feedback], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const createCourse = (body) => {
  return new Promise(function(resolve, reject) {
    const { name, university, course, description, subjects, topics, date, user, feedback, username, image, price, channel_url, is_draft, address } = body
    pool.query('INSERT INTO courses (name, university, subjects, course, description, topics, feedback, date, "user", username, image, price, channel_url, is_draft, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *', [name, university, subjects, course, description, topics, feedback, date, user, username, image, price, channel_url, is_draft, address], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const editCourse = (body) => {
  return new Promise(function(resolve, reject) {
    const { id, name, university, course, description, subjects, topics, date, image } = body
    pool.query('UPDATE courses SET name = $1, university = $2, course = $3, description = $4, subjects = $5, topics = $6, date = $7, image = $8 WHERE id = $9', [name, university, course, description, subjects, topics, date, image, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const sendFeedback = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, userId, updatedCourseFeedbacks, updatedUserFeedbacks} = body
    pool.query('UPDATE courses SET feedback = $1 WHERE id = $2', [updatedCourseFeedbacks, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
    pool.query('UPDATE users SET feedback = $1 WHERE id = $2', [updatedUserFeedbacks, userId], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const updateBio = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, bioValue} = body
    pool.query('UPDATE users SET description = $1 WHERE id = $2', [bioValue, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const updateUniv = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, uniValue} = body
    pool.query('UPDATE users SET university = $1 WHERE id = $2', [uniValue, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const updateCourse = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, cValue} = body
    pool.query('UPDATE users SET course = $1 WHERE id = $2', [cValue, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const updateSubjects = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, selectedOptions} = body
    pool.query('UPDATE users SET subjects = $1 WHERE id = $2', [selectedOptions, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const updatePN = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, imageSrc, isNotify} = body
    pool.query('UPDATE users SET notify = $1, photo_url = $2 WHERE id = $3', [isNotify, imageSrc, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const delCourse = (body) => {
  return new Promise(function(resolve, reject) {
    const {id} = body
    pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const updateUser = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, imageSrc, isNotify, selectedOptions, cValue, uniValue, bioValue} = body
    pool.query('UPDATE users SET description = $1, university = $2, course = $3, subjects = $4, notify = $5, photo_url = $6 WHERE id = $7', [bioValue, uniValue, cValue, selectedOptions, isNotify, imageSrc, id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const userPaidCoursesId = (id) => {
  return new Promise (function(resolve, reject) {
    pool.query('SELECT DISTINCT course_id FROM transactions WHERE buyer_id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const userMadeCoursesId = (id) => {
  return new Promise (function(resolve, reject) {
    pool.query('SELECT id FROM courses WHERE "user" = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const successPayment = (body) => {
  return new Promise(function(resolve, reject) {
    const {id, cid, amount, date, seller_id} = body
    pool.query('UPDATE courses SET amount = $1 WHERE id = $2', [amount, cid], (error, results) => {
      if (error) {
        reject(error)
      }
    })
    pool.query('INSERT INTO transactions (course_id, buyer_id, date, seller_id) VALUES ($1, $2, $3, $4) RETURNING *', [cid, id, date, seller_id], (error, results) => {
      if (error) {
        reject(error)
      }
    })
  })
}

const userPaidCoursesFull = (id) => {
  return new Promise (function(resolve, reject) {
    pool.query('SELECT * FROM transactions WHERE buyer_id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const userSelledCoursesFull = (id) => {
  return new Promise (function(resolve, reject) {
    pool.query('SELECT * FROM transactions WHERE seller_id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getCoursesByIds = (body) => {
  return new Promise((resolve, reject) => {
    const {ids} = body
    pool.query('SELECT * FROM courses WHERE id = ANY($1::int[])', [ids], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};


  module.exports = {
    getCourses,
    createCourse,
    sendFeedback,
    getUser,
    createUser,
    getUserCourses,
    getCourse,
    updateBio,
    updateUniv,
    updateCourse,
    updateSubjects,
    updatePN,
    editCourse,
    delCourse,
    getSubscribedUsers,
    updateUser,
    userPaidCoursesId,
    userMadeCoursesId,
    successPayment,
    userPaidCoursesFull,
    userSelledCoursesFull,
    getCoursesByIds
  }
