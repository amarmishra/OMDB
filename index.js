require('dotenv').config()
const express=require('express')
const PORT=process.env.EXPRESS_SERVER_PORT_NO || 8000
const app=express()


app.use(express.static('./assets'))
app.set('view engine','ejs')
app.set('views','./views')



//parse req urlencoded data and json  

app.use(express.urlencoded({extended:false}))
app.use(express.json({limit:'1mb'}))



app.get('/',(req,res)=>{
   return res.render('index')
})

app.get('/favourites',(req,res)=>{
    return res.render('favourites')
 })

app.listen(PORT,(err)=>{
    if(err){return console.log(`Error:${err}`)}
    console.log(`EXPRESS Server running successfully on port${process.env.EXPRESS_SERVER_PORT_NO}`)
})
