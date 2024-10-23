const express = require("express");

let fellows = [{firstName: 'Kelvin', lastName: 'Akproko', phone: '08120001132'}];

const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get("/",  function (req, res){
    
   res.render('index.ejs', {title : 'Home Page', fellows: fellows});
})

app.post('/add-fellow', function (req, res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phone = req.body.phone;

    if (firstName != null && lastName != null && phone != null) {
        const newFellow = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
        }
        fellows.push(newFellow);
    } 
    res.redirect('/');
    
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error.ejs');
  });


module.exports = app;