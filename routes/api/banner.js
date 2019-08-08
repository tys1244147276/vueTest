let express = require('express')

let router = express.Router()

let mgdb = require('../../utils/mgdb')

router.get('/',(req,res,next)=>{
    mgdb({
        collectionName:'banner'
    },(collection,client)=>{
        collection.find({},{
            limit:req.query._limit,
            skip:req.query._page * req.query._limit,
            sort:{[req.query._sory]:1}
        }).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'集合操作失败'})
            }else{
                res.send({err:0,msg:'成功',data:result})
            }
        })
    })
})


router.get('/:_id',(req,res,next)=>{
    let _id = req.params._id;
    mgdb({
        collectionName:'banner'
    },(collection,client,ObjectID)=>{
        collection.find({
            _id:ObjectID(_id)
        }).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'集合操作失败'})
            }else{
                if(result.length>0){
                    res.send({err:0,msg:'成功',data:result[0]})
                }else{
                    res.send({err:1,msg:'查无数据'})
                }
            }
        })
    })
})

module.exports = router