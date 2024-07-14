const { raw } = require("body-parser");
const db = require("../models/index");
const {where,Op} = require("sequelize");

const addComment = async (content,MaSinhVien,MaBaiThi,binhLuanCha) =>{
    var data = { status: null, data: null };
    try{
        const comment = await db.Comment.create({
            content,
            MaSinhVien,
            MaBaiThi,
            binhLuanCha,
        });

        if(comment){
            data.status = 200;
        }
        else{data.status = 404;}
        return data
    }catch(err){
        data.status = 500;
        return data
    }
}

const getComments = async (id)=>{
    var data = {status : null, data:null};

    try{
        const comments = await db.Comment.findAll(
            {
                where : {MaBaiThi:id,binhLuanCha:null}
            }
            ,{
                raw:true,
            }
        );
        if(comments.length>0){
            data.status = 200;
            data.data = comments;
        }
        else{
            data.status = 404 ;
            data.data = "";
        }
        return data;
    }catch(error){
        return {status:500};
    }
}

const getReplyComment = async (id)=>{
    var data = {status : null, data:null};

    try{
        const comments = await db.Comment.findAll(
            {
                where : {binhLuanCha:id}
            }
            ,{
                raw:true,
            }
        );
        if(comments.length>0){
            data.status = 200;
            data.data = comments;
        }
        else{
            data.status = 404 ;
            data.data = "";
        }
        return data;
    }catch(error){
        return {status:500};
    }
}

module.exports = {
    addComment,
    getComments,
    getReplyComment,
}