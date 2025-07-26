import express from 'express'
import mongoose from 'mongoose'
import User from '../Model/userModel.js'

const createUser = async (req,res)=>{

    try {
        console.log(req.body);
       const user = await User.create(req.body);
       
    } catch (error) {
        console.log("error..",error);
        res.json({
            message:"error .."
        })
        
    }
    res.json({
        message:"data add sucessfully" 
    
    })

}

const login = (req,res)=>{
    const {username} = req.body ;

    const myuser = User.findOne({username:username}) ;

    if(!myuser)
    {
        res.status(404).json({
            message:"data not find .."
           
        })
        
    }
    res.json({
        message:"user sucess login ..>",
        data :username
    })

}

const serchuser = async(req,res)=>{
     const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error searching user' });
  }
}
export default {login , createUser,serchuser}