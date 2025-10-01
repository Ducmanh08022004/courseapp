const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req,res)=>{
  const {name,email,password} = req.body;
  const exists = await User.findOne({ where:{email} });
  if(exists) return res.status(400).json({msg:'Email exists'});
  const hash = await bcrypt.hash(password,10);
  await User.create({name,email,passwordHash:hash});
  res.json({msg:'ok'});
});

// Login
router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({ where:{email} });
  if(!user) return res.status(400).json({msg:'Invalid'});
  const ok = await bcrypt.compare(password,user.passwordHash);
  if(!ok) return res.status(400).json({msg:'Invalid'});
  const token = jwt.sign({id:user.id,role:user.role}, JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id,name:user.name,email:user.email,role:user.role}});
});

module.exports = router;
