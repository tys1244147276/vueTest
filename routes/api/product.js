let express = require('express')

let router = express.Router()

let mgdb = require('../../utils/mgdb')

let findList = ({req,res,apiname})=>{
    
    

    let {_page,_limit,q,_sort} = req.query;

    
    
    let qq = q ? {title:eval('/'+q+'/')} : {}



    mgdb({
        collectionName:apiname
    },(collection,client)=>{
        
        collection.find(qq,{
            skip:_page*_limit,
            limit:_limit,
            sort:{[_sort]:1}
        }).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'集合操作失败'})
            }else{
                res.send({err:0,msg:'成功',data:result})
            }
            client.close();
        })
    })
}

let findDetail = ({apiname,req,res,_id})=>{
    mgdb({
        collectionName:apiname
    },(collection,client,ObjectID)=>{
        collection.find({
            _id:ObjectID(_id)
        },{}).toArray((err,result)=>{
            if(err){
                res.send({err:1,msg:'集合操作失败'})
            }else{
                if(result.length>0){
                    res.send({err:0,msg:'成功',data:result[0]})
                }else{
                    res.send({err:1,msg:'查无数据'})
                }
            }
            client.close()
        })
    })
}

router.get('/',(req,res,next)=>{
    let apiname = req.rootParams;
    let _id = req.query._id;
    if(/home|follow|column/.test(apiname)){
        if(_id){
            findDetail({req,res,_id,apiname})
        }else{
            findList({req,res,apiname})
        }
    }else{
        next();
    }
})

router.get('/:_id',(req,res,next)=>{
    let apiname = req.rootParams;
    let _id = req.params._id;

    if(/home|follow|column/.test(apiname)){
        findDetail({req,res,_id,apiname})
    }else{
        next();
    }
})

module.exports = router