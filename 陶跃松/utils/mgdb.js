let mongodb = require("mongodb")

let mongoCt = mongodb.MongoClient

let objectID = mongodb.ObjectID

module.exports = ({
    url='mongodb://127.0.0.1:27017',
    dbName='sh1905',
    collectionName
    },callback)=>{
        collectionName = collectionName || 'user'

        mongoCt.connect(url,{useNewUrlParser:true},(err,client)=>{
            if(err){
                console.log("链接mongodb服务端失败")
            }else{
                let db = client.db(dbName)

                let collection = db.collection(collectionName)

                callback(collection,client,objectID)
            }
        })
}