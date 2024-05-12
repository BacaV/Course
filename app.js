const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(async(req, res)=>{
        try{
            
            let result = await Article.find({});
            res.send(result);

        }catch(err){

            console.log(err);

        }
    })
    .post(async(req, res)=>{
        try{

            const newArticle = new Article ({
                title : req.body.title,
                content : req.body.content
            });
        
            newArticle.save();
        
            res.send("added");

        }catch(err){

            console.log(err);

        }
    })
    .delete(async(req, res)=>{
        try{        

            let result = await Article.deleteMany({});
            res.send(result);

        }catch(err){

            console.log(err);

        }
    });


    app.route("/articles/:articleTitle")
    .get(async(req,res)=>{
        try{

        let params = req.params.articleTitle

        let result = await Article.findOne({title: params});
        res.send(result);
        
        
        }catch(err){
        console.log(err)
    }})
    .put(async(req, res) => {
        try{

            let params = req.params.articleTitle

            await Article.findOneAndUpdate(
                {title: params},
                {title: req.body.title, content: req.body.content},
                {overwrite: true}
            );

            res.send("Updated article successfully.");

        } catch(err){

            console.log(err);

        }
    });





app.listen(3000, function(){
    console.log('Server started!');
});