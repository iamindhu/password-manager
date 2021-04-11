const User = require("../models/User");
const jwt = require('jsonwebtoken');
const moment = require('moment');


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', mobile: '', username:'', cred:''};

  // duplicate error
  if (err.code === 11000) {
    errors.cred = 'These credentials already exist';
    return errors;
  }

  // incorrect username
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // validation errors
  if (err.message.includes('user validation failed')) {

    Object.values(err.errors).forEach(({ properties }) => {
 
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          res.redirect('/welcome')
        }
      });   
    } else {
      res.render('login');
    }
}

module.exports.signup_post = async (req, res) => {
  const{ email, password, mobile, username } = req.body;

  try {
    const user = await User.create({ email, password, mobile, username });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.logout_get = (req, res) => {
  const token = req.cookies.jwt; 
  jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      let user = await User.findById(decodedToken.id); 
      const event = 'User Logged Out';
      if(user)
      {user.history.push({event});
      user.save();}
  });
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.welcome_get = (req, res) =>{
  const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          //console.log(User.collection.estimatedDocumentCount({}));
          let user = await User.findById(decodedToken.id); 
          res.render('welcome',{userobj:user, moment:moment});
        }
      });   
    } else {
      res.redirect('/login');
    }
}

module.exports.deleteuser_get = (req, res) =>{
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      res.redirect('/logout');
      let user = await User.findById(decodedToken.id);
      user.remove({_id:decodedToken.id});
    });
  }
}

module.exports.accounthistory_get = (req, res) =>{
  const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          let user = await User.findById(decodedToken.id); 
          res.render('accounthistory',{userobj:user, moment:moment});
        }
      });   
    } else {
      res.redirect('/login');
    }
}