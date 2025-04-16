const express=require("express");
const fs = require("fs");
const app=express();
const users = require("./MOCK_DATA.json");
const { json } = require("stream/consumers");
const { error } = require("console");

app.use(express.urlencoded({extended:false}));
app.get('/users',(req,res)=>
{
    res.json(users)
})
app.post('/api/users',(req,res)=>{
    const body=req.body;
    users.push({...body,id:users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        if(err)
        {
            return res.status(500).json({error:"user not saved"});
        }
        return res.status(200).json({Successful:"user saved successfully"});
    })
})
app.patch('/api/users/:id',(req,res)=>{
    const body = req.body;
    const id = parseInt(req.params.id);
    const index = users.findIndex((user)=>user.id===id);
    if(index===-1)
    {
        res.status(404).json({error:"User not found"});
    }
    users[index] = { ...users[index], ...body };

    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        if(err)
        {
            return res.status(500).json({error:"user data not saved ! error found"});
        }
        return res.status(200).json({status:"Updated",user:users[index]});
    })


})


app.listen(8000,()=>console.log("Server started Successsfuly"))