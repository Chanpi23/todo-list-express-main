const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()// hold secret things like variables keys ( needs to put them in as a variable )

let db,// shorten up variables 
    dbConnectionStr = process.env.DB_STRING, // look here for enviormetnal  variable connection string 
    dbName = 'todo' //  variable assignment 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // conect to the database using string about
// unifiedtopolgy - opt in for a new verison of MOngoDB connection ( stays active), better performance 
    .then(client => { // after connection then
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // assing the db variable from line 8 
    })
    
app.set('view engine', 'ejs')//  set the options for the express app we  assigned earlier 
app.use(express.static('public')) // 
app.use(express.urlencoded({ extended: true })) // middleware - l;ook in the public  folder for routes we call up later; comes between the request and response
app.use(express.json()) // more settings


app.get('/',async (request, response)=>{ // client requests the route page- we send back these or errors
    const todoItems = await db.collection('todos').find().toArray() // wait for the database to reply; concert the documents ffrom database into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // wait for the database  to reply; grab the specific documents that have a false status 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // shows us the goods
    // db.collection('todos').find().toArray() -> find the todos, put in array
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})-> find the number of not completed 
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) -> if we hit an error lets us know 
})

app.post('/addTodo', (request, response) => {// update from the CRUD or create 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //add a new item/document  add a new item to our todo list on database; insert in the body of the todoitem and automatically set it to false for completed 
    .then(result => {
        console.log('Todo Added')// let us know that we successfully adds a todo
        response.redirect('/') //  go back to the route screen
    })
    .catch(error => console.error(error)) // uh oh we got an error here you go 
})

app.put('/markComplete', (request, response) => { //update some parts of the documents on our database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change the todo
        $set: {
            completed: true // mark it as complete
          }
    },{
        sort: {_id: -1}, // sort by id: descending  biggest to smallest so it ends up last?
        upsert: false // update+ insert = upsert the rendering so 
    })
    .then(result => {// second do:
        console.log('Marked Complete') // let us know it worked 
        response.json('Marked Complete') // let the client know it worked 
    })
    .catch(error => console.error(error)) // if error shove it in console log

})

app.put('/markUnComplete', (request, response) => {//update documents round 2: fight the man 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false// we didnt actually do this to so it undone
          }
    },{
        sort: {_id: -1}, // sort by id: this thing goes last
        upsert: false // don't add a double 
    })
    .then(result => { // set up result in caswe we use it later but we don't use it now
        console.log('Marked Incomplete') 
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // YO FAMM WE GOT ISSUES

})

app.delete('/deleteItem', (request, response) => { 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete that bad boy
    .then(result => { // again, result in case we want it later 
        console.log('Todo Deleted') // it worked - to server
        response.json('Todo Deleted')// it worked - to client 
    })
    .catch(error => console.error(error)) // merp problems

})

app.listen(process.env.PORT || PORT, ()=>{ // this is where we listen to the PORT; first one is for the herokus set or relse use the one we declared 
    console.log(`Server running on port ${PORT}`) // this lets us know we are connected the the server 
})