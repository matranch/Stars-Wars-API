const {parseTab} = require('./parseTab.js')
const {compareTab} = require('./compareTab.js')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/'
const fs = require('fs')
const vm = require('vm')

function calldb(){
let i = 1
let j = 0
let res = null
let tab = []
let ftab = []
 MongoClient.connect(url, {useNewUrlParser : true}, async function (err, db){
    if(err) throw err
    var dbo = db.db("db")
    await dbo.createCollection("starwars")
    res = await dbo.collection("starwars").find({}).toArray()
    if(res.length == 0){
      tab = await insertTab(dbo, tab)
      res = await dbo.collection("starwars").find({}).toArray()
      }
    if((res[0].count + 1) != res.length){
      console.log('db not complete')
      res = await dbo.collection("starwars").deleteMany({})
      console.log("deleted : "+res.deletedCount)
      tab = await insertTab(dbo, tab)
    }
    else
      tab = res
    while(i < (res[0].count + 1)){
      ftab[i] = await compareTab(res, i, tab, ftab)
      i++
    }
    eval(fs.readFileSync(__dirname + '/api.js')+'')
    await db.close(console.log('db close'))
  })
}

async function insertTab(dbo, tab){
    console.log('db in creation...')
    tab = await parseTab(tab)
    res = await dbo.collection("starwars").insertMany(tab)
    console.log("insert : "+res.insertedCount)
    return(tab)
}

module.exports = {
  calldb : calldb
}
