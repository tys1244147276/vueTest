let express = require('express')

let router = express.Router()

let mgdb = require('../../utils/mgdb')

router.get('/',(req,res,next)=>{
    if(!req.session['news_user']){
        res.send({err:1,msg:'未登录'})
    }else{
        mgdb({
            collectionName:'user'
        },(collection,client,ObjectID)=>{
            collection.find({
                _id:ObjectID(req.session['news_user'])
            },{
                projection:{username:0,password:0}
            }).toArray((err,result)=>{
                if(err){
                    res.send({err:1,msg:'集合操作失败'})
                }else{
                    res.send({err:0,msg:'自动登录',data:result[0]})
                }
            })
        })
    }
})

module.exports = router