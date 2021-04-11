const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
var {encrypt, decrypt} = require('../models/aescrypto');
module.exports.addpassword_get = (req, res) => {
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
      } else {
          let user = await User.findById(decodedToken.id);
           res.render('addpassword', {userobj:user});  
      }
    });
  }
  else{
    res.redirect('/login');
  }
  }
module.exports.accesspassword_get = (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
          } else {
              let user = await User.findById(decodedToken.id);
               res.render('accesspassword', {allpasswords:user.addpassword, decrypt:decrypt, userobj:user});  
          }
        });
      } else {
        res.redirect('/login');
      }
}
module.exports.addpassword_post = async (req, res) => {
  const { password_category, username_a, password_hint, password_a } = req.body;
  try {
    const addp = {password_category, username_a, password_hint, password_a };
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
        } else {
            let user = await User.findById(decodedToken.id);
            addp.password_a = encrypt(addp.password_a);
            user.addpassword.push(addp);
            const event = 'New Password Category: '+ password_category + ' Added';
            user.history.push({event});
            const updated = await user.save();   
        }
      });
    } else {
      res.redirect('/login');
    }
  }
  catch(err) {
      console.log(err);
  }
  }

  module.exports.delpassword_post = async(req, res) =>{
    const { id, password } = req.body;
    const token = req.cookies.jwt;
    if(password != null){
    if(token){
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
            if (err) {
            //   res.locals.user = null;
            } else {
                let user = await User.findById(decodedToken.id);
                let pass = user.addpassword.id(id);
                const auth = await bcrypt.compare(password, user.password);
                if(auth){
                const event = 'Delete Password Category: '+pass.password_category +' SUCCESSFUL';
                user.addpassword.remove({_id:id});
                user.history.push({event});
                user.save(); 
                res.status(200).json({ status: true });  
                }
                else{
                  const event = 'Delete Password Category: '+pass.password_category +'  FAILED';
                  user.history.push({event});
                  user.save(); 
                  res.status(200).json({ status:false });
                }
            }
          });
    }
  }
  }

  module.exports.displaydeets_post = async(req, res) =>{
    const { id , password} = req.body;
    const token = req.cookies.jwt;
    if(password != null){
    if(token){
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
            if (err) {
            //   res.locals.user = null;
            } else {
                let user = await User.findById(decodedToken.id);
                let pass = user.addpassword.id(id);
                const auth = await bcrypt.compare(password, user.password);
                if(auth){
                const event = 'Access to Password Category: '+pass.password_category +' Request SUCCESSFUL';
                user.history.push({event});
                user.save(); 
                res.status(200).json({ status:true });  
                }
                else{
                  const event = 'Access to Password Category: '+pass.password_category +' Request FAILED';
                  user.history.push({event});
                  user.save(); 
                  res.status(200).json({ status:false });
                }
            }
          });
    }
  }
  }
