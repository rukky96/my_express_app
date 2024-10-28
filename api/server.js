
// Supabase was used as the database to host data. The supabaseUrl and supabaseKey were obtained from the project section I created on Supabase
const dotenv = require('dotenv');
dotenv.config();


const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const port = process.env.PORT || 3000;


app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.static(path.join(__dirname, '/../public')));

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


app.get("", async function (req, res){

});

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

app.get("/api/fellows", async function (req, res) {
  const { data: fellows, error } = await supabase
    .from('fellows')
    .select('*');

  if (error) {
    console.error('Error fetching fellows:', error);
    return res.status(500).json({ message: 'Error retrieving fellows' });
  }

  // Return the list of fellows in JSON format
  res.status(200).json(fellows);
  console.log(fellows);
});


app.post('/api/fellows', async function (req, res) {
  const { firstName, lastName, phone } = req.body;

  // Validate input fields
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Insert fellow into Supabase
  const { data, error } = await supabase
    .from('fellows')
    .insert([{ firstName, lastName, phone }])
    .select();

  if (error) {
    console.error('Error adding fellow:', error);
    return res.status(500).json({ message: 'Error saving fellow' });
  }

  if (data && data.length > 0) {
    res.status(201).json({ message: 'Fellow added successfully', fellow: data[0] });
} else {
    res.status(500).send('Fellow added but no data returned');
}

});

app.get('/questions', function(req, res) {
  res.render('addQuestion')
})


app.post('/questions', async function (req, res) {
  var subject = req.body.subject;
  var question = req.body.question;
  var topic = req.body.topic;
  var optionA = req.body.optionA;
  var optionB = req.body.optionB; 
  var optionC = req.body.optionC;
  var optionD = req.body.optionD;
  var correctOption = req.body.correctOption;
  var explanation = req.body.explanation;
  var addedBy = req.body.email

  const {data, error} = await supabase
  .from('questions')
  .insert([{subject, question, topic, optionA, optionB, optionC, optionD, correctOption, explanation, addedBy}])
  .select()

  if (error) {
    console.log(error);
  }

  console.log(req.body);
  console.log(data[0]);
  res.redirect('/questions');


})



app.listen(port, () => {
    console.log("Port is running");
})

module.exports = app;