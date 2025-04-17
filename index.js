const express = require("express");
const users  = require('./MOCK_DATA.json');
const fs = require("fs");
const mongoose= require("mongoose");


const { error } = require("console");
const { type } = require("os");
const app = express();

//connectiion
mongoose
    .connect('mongodb://127.0.0.1:27017/youtubeapp-1')
    .then(()=>console.log("Mongodb Connected"))
    .catch((err)=>console.log("Mongo Error",err));



// Schema of Mongoose
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,

        
    },
    email:{
        type:String,
        required: true,
        unique:true,

    },
    JOB_TITLE:{
        type:String,
    }
})

const User=mongoose.model('user',userSchema);


//Middleware Plugin
app.use(express.urlencoded({extended:false}));//urlencoded is from postman body section it is a data which  comes from forms



//Middleware

app.use((req,res,next)=>{
    console.log("Hello from middleware1");
    req.myUsername ="AyushKumar"
    next();
    
})
app.use((req,res,next)=>{
    console.log("Hello from middleware2",req.myUsername); // can get access to other middlewares 
    next();
    
})//wecan also create a logger file 

app.use((req,res,next)=>{
fs.appendFile("log.txt",`\n${Date.now()}: ${req.url}:${req.path}`,(err)=>{
    if(err)
    {
        console.error("Logging failed:", err);    }
});
    next();
    
})



app.get('/api/users',(req,res)=>{
    res.json(users)
})



app.get('/api/users/:id',(req,res)=>{   //here :id a variable we use colon for dynamic or variable
const id = req.params.id
const user = users.find((user)=>user.id==id);
if(!user)
{
    res.status(404).json({msg:"User Does not Exist"});
}
return res.json(user)

})
app.get('/users',(req,res)=>{
    const  html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>`;
    res.send(html);
})
app.post('/api/users',(req,res)=>{
    const body = req.body; //whatever we send on server is coming here example like we did the name last name email etc in postman

if(!body||!body.first_name || !body.last_name||!body.email||!body.gender||!body.JOB_TITLE)
{
    return res.status(400).json({ msg: "All Fields are required" });

}



users.push({...body,id:users.length+1});    
fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
    return res.status(201).json({status:"Success",id:users.length});

})
})
// app.patch('/api/users',(req,res)=>{
//     
// })
// app.delete('/api/users',(req,res)=>{
//     return res.json({status:"pending"});
// })




// or you can also try this 


app
    .route("/api/users/:id")
    .get((req,res)=>{   //here :id a variable we use colon for dynamic or variable
        const id = req.params.id
        const user = users.find((user)=>user.id==id);
        return res.json(user.first_name)
        
        })
        .post((req,res)=>{
            return res.json({status:"pending"});
        })
        .patch((req,res)=>{
            const body = req.body;
            const id = parseInt(req.params.id)
            const index=users.findIndex(user=>user.id===id);
            if(index===-1)
            {
                return res.status(404).json({error:"user not found"});
            }
            users[index]={...users[index],...body};
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to update user" });
                }
                return res.json({ status: "Updated", user: users[index] });
            });
        })
        .delete((req,res)=>{
            const id = req.params.id;
            const Index = users.findIndex((user)=>user.id==id);
            if(Index===-1)
            {
                return res.status(404).json({error:"user not found"});

            }
            const deleteduser= users.splice(Index,1);

            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to delete user" });
                }
                return res.json({ status: "Deleted", user: deleteduser[0] });
            });
            




            return 
        })
        
app.listen(8000,()=>console.log("Server started successfully"));
