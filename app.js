//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const pass = process.env.PASSWORD;
mongoose.connect("mongodb+srv://admin-aditya:" + pass + "@cluster0.vhzxg.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);

const defaultItem = [];

app.get("/", function(req, res) {

  const day = date.getDate();
  Item.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  })

});

app.post("/", function(req, res){

  const newItem = req.body.newItem;

  const item = new Item({
    name: newItem
  });

    item.save();
    res.redirect("/");  
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/");
      }
    });  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
