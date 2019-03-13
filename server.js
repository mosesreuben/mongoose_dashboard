// ------------------SETUP-----------------------------
var express = require("express");
var path = require("path");
var mongoose = require('mongoose');	
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/salmon');
//--------------------------DB  SCHEMAS--------------------
var SalmonSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2},
    description: { type: String, required: true, minlength: 5}
  }, {timestamps: true});
  
  mongoose.model("Salmon", SalmonSchema);
  var Salmon = mongoose.model("Salmon");
// --------------------------------------------------------
app.get('/', function(req, res) {
  arr = Salmon.find({}, function(err, salmon) {
      res.render('index', {arr:salmon});
  })
})
app.get('/salmon/new', function(req, res) {
  res.render('new');
})

app.post('/add', function(req, res) {
console.log("POST DATA", req.body);
var salmon = new Salmon({name: req.body.name, favorite_color: req.body.favorite_color});
salmon.save(function(err) {
  if(err) {
    console.log('something went wrong');
    console.log(salmon.errors);
    res.redirect('/')
  } 
  else {
    console.log('successfully added a Salmon!');
    res.redirect('/');
  }
})
})

app.get('/salmon/edit/:id', function(req, res) {
  salm = Salmon.findOne({_id: req.params.id}, function(err, salmon) {
      console.log(salmon);
      res.render('edit', {salm:salmon});
  })
})
app.post('/change/:id', function(req, res) {
  console.log("POST DATA", req.body);
  Salmon.update({_id: req.params.id},
                  {name: req.body.name,
                  favorite_color: req.body.favorite_color},
                  function(err){
                      if(err) {
                          console.log('something went wrong');
                          console.log(salmon.errors);
                          res.redirect(`/salmon/edit/${req.params.id}`)
                      } 
                      else {
                          console.log('successfully changed a Salmon!');
                          res.redirect(`/salmon/${req.params.id}`);
                      }

  })
})
app.post('/delete/:id', function(req,res){
  Salmon.remove({_id: req.params.id}, function(err){
      console.log("RECORD DELETED");
      res.redirect('/');
  })
})
app.get('/salmon/:id', function(req, res) {
  salm = Salmon.findOne({_id: req.params.id}, function(err, salmon) {
      console.log(salmon);
      res.render('salmon', {salm:salmon});
  })
});
//--------------------LISTEN-----------------
app.listen(8000, function() {
    console.log("listening on port 8000");
   });