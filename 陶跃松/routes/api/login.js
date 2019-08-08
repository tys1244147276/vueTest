let express = require('express')

let router = express.Router()

let mgdb = require('../../utils/mgdb')

let bcrypt  = require("bcrypt")

router.post('/',(req,res,next)=>{
    let {username,password} = req.body;

    if(!username || !password){
        res.send({err:1,msg:'用户名和密码为必传参数'})
        return;
    }

    mgdb({
        collectionName:'user'
    },(collection,client)=>{
        collection.find({
            username
        },{
            projection:{
                username:0
            }
        }).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'user集合操作失败'})
                client.close();
            }else{
                if(result.length>0){
                    let userdata = result[0];

                    let pass = bcrypt.compareSync(password,userdata.password);
                    
                    if(pass){
                        req.session['news_user'] = userdata._id;
                        res.send({err:0,msg:'登陆成功',data:userdata})
                    }else{
                        res.send({err:1,msg:'用户名或密码错误'})
                    }
                    
                }
                client.close()
            }
        })
    })
})

module.exports = router