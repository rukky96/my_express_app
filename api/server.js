const { createClient } = require('@supabase/supabase-js');

const express = require("express");

const supabaseUrl = 'https://txukkxbkfzeqiozjakrp.supabase.co';  // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4dWtreGJrZnplcWlvempha3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2NzE1NzcsImV4cCI6MjA0NTI0NzU3N30.IBbc9TpcjE3O2QXBaY2ORfZfUzq9zgwUSB7P33L7aqM';  // Your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

let fellows = [
];


app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.static(path.join(__dirname, '/../public')));

app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get("/",  async function (req, res){

  const {data: fellows, error} = await supabase
    .from('fellows')
    .select('*');

    if (error)  {
      console.error('Error fetching fellows:', error);
      return res.status(500).send('Error retrieving fellows');
    }
    
   res.render('index', {title : 'Home Page', fellows});
   console.log(fellows);
})

app.post('/add-fellow', async function (req, res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phone = req.body.phone;

    if (firstName != null && lastName != null && phone != null) {
        const {error} = await supabase 
        .from('fellows')
        .insert([{firstName, lastName, phone}]);

        if (error) {
          console.error('Error adding fellow:', error);
          return res.status(500).send('Error saving fellow');
        }

        res.redirect('/');
        
    } else {
      res.status(400).send('All fields are required');
    }
    
})



app.listen(port, () => {
    console.log("Port is running");
    console.log(fellows);
})

module.exports = app;