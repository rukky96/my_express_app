const express = require("express");



const app = express();
const path = require('path');
const fs = require("fs");
const fellowsFilePath = path.join(__dirname, "fellows.json");

const port = process.env.PORT || 3000;

let fellows = [
];

fs.readFile(fellowsFilePath, "utf8", (err, data) => {
    if (!err && data) {
      fellows = JSON.parse(data);
    }
  });


app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.static(path.join(__dirname, '/../public')));

app.use(express.urlencoded({ extended: true }));

app.get("/",  function (req, res){
    
   res.render('index', {title : 'Home Page', fellows: fellows});
   console.log(fellows);
})

app.post('/add-fellow', function (req, res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phone = req.body.phone;

    if (firstName != null && lastName != null && phone != null) {
        const newFellow = {
            firstName,
            lastName,
            phone,
        }
        fellows.push(newFellow);

        
        fs.writeFile(fellowsFilePath, JSON.stringify(fellows, null, 2), (err) => {
            if (err) console.error("Error saving data:", err);
          });
        
    } 
    res.redirect('/');
    
})



app.listen(port, () => {
    console.log("Port is running");
    console.log(fellows);
})

module.exports = app;