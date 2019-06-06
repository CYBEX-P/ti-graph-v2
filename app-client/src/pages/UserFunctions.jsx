import axios from 'axios';

export const register =  newUser => {
  axios
    .post('/users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      username: newUser.username,
      password: newUser.password
    }).then(({data}) => {console.log(data)})
  return "submitted"
};

export const login = user => {
  return axios
    .post('/users/login', {
      username: user.username,
      password: user.password
    })
    .then(res => {
      console.log(res.data);
      localStorage.setItem('token', JSON.stringify(res.data));
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return {"Exit" : "1"}
    });
};

export const remove = user => {
  return axios
    .post('/remove', {
      username: user.username
    })
    .then(() => {
      console.log('deleted');
    });
};

export const update = user => {
  return axios
    .post('/update', {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username
    })
    .then(() => {
      console.log('updated');
    })
    .catch(err => {
      console.log(err);
    });
};

export const find = user => {
  return axios
    .post('/find', {
      username: user.username
    })
    .then(res => {
      console.log(res.data);
    });
};
