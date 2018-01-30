const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const commnent = new mongoose.Schema({
    creator:{type:ObjectId,ref:'User', required:true},
    title:{type:String,required:true},
    description:String,
    creationDate:{type:Date,required:true}
})


module.exports = mongoose.model('Comment',commnent)