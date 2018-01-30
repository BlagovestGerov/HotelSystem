const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

//TODO
//cat => cat require

const hotel = new mongoose.Schema({
    title:{type:String,required:true},
    location:{type:String,required:true},
    image:{type:String,required:true},
    category:{type:String},
    description:{type:String},
    like:[{type:ObjectId,ref:'User'}],
    viewCounter:{type:Number,default:0},
    dataCreation:{type:Date,required:true}
})

module.exports = mongoose.model('Hotel', hotel);