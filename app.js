require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const File = require('./models/File')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')


app = express()
app.set('view engine','ejs')
app.engine('ejs',require('ejs').__express)
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect(process.env.DATABASE_URL)

const upload = multer({dest:'upload/'})

app.get('/',(req,res)=>{
	res.render('index')
})

app.post('/upload',upload.single('file'),async (req,res)=>{
	const file = {
     path:req.file.path,
     originalname:req.file.originalname
	}

    if(req.body.password != null && req.body.password!=''){
         file.password = await bcrypt.hash(req.body.password,10)
    }

	const newFile = await File.create(file)

	res.render('index',{link:`http://${req.headers.host}/file/${newFile.id}`})

})

app.route('/file/:id').get(handledownload).post(handledownload)

async function handledownload(req,res) {
	const file = await File.findById(req.params.id) 

      if(file.password != null){
   	    if(req.body.password == null){
   		res.render('password')
   		return
   	}
   }

   if(file.password){
   if(!(await bcrypt.compare(req.body.password,file.password))){
   	res.render('password',{error:true})
     return
   }
}
  
  
   file.downloadCount++
   file.save()

   res.download(file.path,file.originalname)
}

app.listen(process.env.PORT,()=>{
	console.log("Server is running on port "+process.env.PORT)
})