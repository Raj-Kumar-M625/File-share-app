const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
	path:{
		type:String,
		require:true
	},
	 originalname:{
        type:String,
        require:true
	},
	password:{
		type:String,
		require:true
	},
	downloadCount:{
		type:Number,
		default:0
	}
})


module.exports = mongoose.model('File',fileSchema)