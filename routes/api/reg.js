let express = require('express')

let router = express.Router()

let mgdb = require('../../utils/mgdb')

let fs = require('fs')

let pathLib = require('path')

let bcrypt = require("bcrypt")

router.post('/',(req,res,next)=>{
    let {username,password,nikename,icon} = req.body;


    if(!username || !password){
        res.send({err:1,msg:'用户名和密码为必传参数'})
        return;
    }

    let follow = 0;
    let fans = 0;
    let time = Date.now();
    nikename = nikename || "系统命名"
    password = bcrypt.hashSync(password,10)

    
    if(!req.file && req.files.length>0){
        fs.renameSync(req.files[0].path,req.files[0].path+pathLib.parse(req.files[0].originalname).ext)
        icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
    }else{
        icon = '/upload/noimage.png'
    }

    

    mgdb({
        collectionName:'user'
    },(collection,client)=>{
        collection.find({
            username
        },{}).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'user集合操作失败'})
                client.close();
            }else{
                if(result.length>0){
                    res.send({err:1,msg:'用户名已存在'})
                    fs.unlinkSync('./public'+icon)
                    client.close()
                }else{
                    collection.insertOne({
                        username,password,nikename,icon,time,follow,fans
                    },(err,result)=>{
                        if(err){
                            res.send({err:1,msg:'user集合操作失败'})
                            client.close();
                        }else{
                            res.send({err:0,msg:'注册成功',data:result.ops[0]})
                        }
                    })
                }
            }
        })
    })
})

module.exports = router