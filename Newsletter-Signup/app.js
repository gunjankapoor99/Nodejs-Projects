const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req,res){
    var fName = req.body.fName;
    var lName = req.body.lName;
    var email = req.body.email;

    // console.log(fName, lName, email);

    var data = {
        members: [
            {email_address: email,
             status: "subscribed",
             merge_fields: {
                FNAME: fName,
                LNAME: lName
             }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url: "https://us6.api.mailchimp.com/3.0/lists/6faf4c7ec6",
        method: "POST",
        headers: {
            "Authorization": "darklegend1 0ccf33b126488c0f44e7c7e0aebccd09-us6"
        },
        body: jsonData
    }

    request(options, function(error,response,body){
         if(error){
            // res.send("There was an error with signup, please try again");
            res.sendFile(__dirname+"/failure.html");
         }else{
            //  console.log(response.statusCode);
            if(response.statusCode == 200){
                res.sendFile(__dirname+"/success.html")
            }else{
                res.sendFile(__dirname+"/failure.html");
            }
         }
    });
});

app.post("/failure", function(req,res){
    // res.sendFile(__dirname+"/signup.html");
    // or
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port 3000");
});