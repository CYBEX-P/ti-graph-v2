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
    alert(`${newUser.username} is Registered `);
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
<<<<<<< HEAD
      localStorage.setItem('usertoken', res.data);
      //alert(`${user.username} is logged in`);
      //post('/tiweb/graph');
=======
      localStorage.setItem('token', JSON.stringify(res.data));
>>>>>>> master
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
      alert(`${user.username} is Deleted`);
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
      alert(`${user.username} is Updated `);
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

export const change_password = newPassword => {
  return axios
  .post('/change_password',{
    username: newPassword.username,
    old_password: newPassword.old_password,
    new_password: newPassword.new_password
  })
  .then(res =>{
    console.log(res.data);
    alert(`Password changed for ${newPassword.username}  `);
  });
};
