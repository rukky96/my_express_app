const express = require("express");
const exams = require("./exams");

let fellows = [{firstName: 'Kelvin', lastName: 'Akproko', phone: '08120001132'}];

const app = express();

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }));

app.get("/",  function (req, res){
    
   res.render('index', {title : 'Home Page', fellows: fellows});
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

app.use('/exams', exams);

app.use(express.static('public'));

app.listen(port, function() {
    console.log('Port is running');
});