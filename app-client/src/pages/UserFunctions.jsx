import axios from 'axios';

export const register =  newUser => {
  return axios
    .post('/users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      username: newUser.username,
      password: newUser.password,
     admin:newUser.admin
    }).then(res => {
      // console.log(res);
      if (res.status === 200){
        if (res.data.Error === "1"){
          return {"Exit" : "1"}
        }
        else if (res.data.Error === "2"){
          return {"Exit" : "2"}
        }
        return {"Exit" : "0"}
      }
    })
    .catch((err) => {
      // console.log(err);
      return {"Exit" : "1", "Type" : "1"}
    });
};

export const login = user => {
  return axios
    .post('/users/login', {
      username: user.username,
      password: user.password
    })
    .then(res => {
      // console.log(res);
      if (res.status === 200){
        if (res.data.Error === "1"){
          return {"Exit" : "1"}
        }
        else if (res.data.Error === "2"){
          return {"Exit" : "2"}
        }
        else if (res.data.Error === "3"){
          return {"Exit" : "3"}
        }
        // localStorage.setItem('token', JSON.stringify(res.data));
        return {"Exit" : "0"}
      }
    })
    .catch((err) => {
      // console.log(err);
      return {"Exit" : "1", "Type" : "1"}
    });
};

export const remove = user => {
  return axios
    .post('/remove', {
      username: user.username
    })
    .then(() => {
      console.log('deleted');
      alert(` ${user.username} is deleted  `);
    });
};

export const update = user => {
  return axios
    .post('/update', {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      admin:user.admin,
      
    })
    .then(() => {
      console.log('updated');
      alert(` ${user.username} is updated  `);
    })
    .catch(err => {
      console.log(err);
    });
};

export const find = user => {
  return axios
    .post('/find', {
      username: user.username, 
    })
    .then(res => {
      console.log(res.data);
      return(res.data)
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

export const logout = ()=>{
  axios.post('/user/logout');
  return true;
}


