const {addComment, getComments, getReplyComment} = require("../services/comment.service");

const jwtHelper = require("../helpers/jwt.helper");
const message = require("../models/message");


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


const addCommentHandler = async (req,res)=>{
    const data = req.body;
    const MaSinhVien = req.jwtDecoded?.data.id ;
    console.log(req.jwtDecoded?.data.id);
    
    try{
        
        const result = await addComment(data.content,req.jwtDecoded?.data.id,data.MaBaiThi,data.binhLuanCha);
        if(result.status === 200){
            res.status(200).json({message: 'Comment has been created!',data:{
                content:data.content,MaSinhVien:req.jwtDecoded?.data.id,MaBaiThi:data.MaBaiThi,binhLuanCha:data.binhLuanCha
            }});
        }
        else{
            res.status(404).json({message:'Comment not created!'});
        }

    }catch(error){
        res.status(500).json(err);
    }
}

const getCommentsHandler = async (req,res)=>{
    const id = req.params.id;
    try{
        const result = await getComments(id);
        if(result.status === 200){
            res.status(200).json(result.data);
        }else if(result.status === 404){
            res.status(404).json({message:"not have comments!"});
        }
    }catch(error){
        res.status(500).json(error);
    }
}


const getReplyCommentHandler = async (req,res)=>{
    const id = req.params.id;
    try{
        const result = await getReplyComment(id);
        if(result.status === 200){
            res.status(200).json(result.data);
        }else if(result.status === 404){
            res.status(404).json({message:"not have comments!"});
        }
    }catch(error){
        res.status(500).json(error);
    }
}





module.exports = {addCommentHandler,getCommentsHandler,getReplyCommentHandler};