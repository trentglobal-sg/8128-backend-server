const express = require('express');
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');

// all .env keys will be available in process.env
const app = express();

// enable JSON in req.body otherwise req.body will be undefined
// express.json() is a middleware - all requests are pass through middlewares before it reaches the route function
// they usually pre-process the request
app.use(express.json());

// enable CORS
app.use(cors());

// route
// a route is a URL fragment associated with a function
// when a client tries to access '/about-us' on the server
// call the function in the second argument
app.get('/', function (req, res) {
    res.send("home/root URL called")
})

app.get('/about-us', function (req, res) {
    // req = request (whatever the client is sending to the server)
    // res = response (whatever the server wants to send back to the client)
    res.send("hello world");
})

// get data from client via route parameters
app.get('/hello/:firstName', function (req, res) {
    const firstName = req.params.firstName;
    res.send("Hello " + firstName);
})

// get data from client via query strings
// there is nowhere at all to state the expected query string parameters
// if the client sends any query strings, it will be in req.query
// example: the search can recieve a name, startDate and endDate query parameter
// example query string: /search?name=IBM&startDate=2026-09-07&endDate=2026-10-07
app.get('/search', function (req, res) {
    const name = req.query.name;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    res.json({
        name, startDate, endDate
    })

})

// for app.post, app.patch and app.put, data can be received via req.body
// those are usually used for create and updates
// req.body can support file uploads, arrays, objects etc.
// suppose the user will send a JSON object with email and password
app.post('/register', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    res.send(`Email ${email} is registered with the password ${password}`);
})

// get the latest bin
app.get('/b/:binID/latest', async function (req, res) {
    const response = await axios.get(`${process.env.JSON_BIN_URL}/b/${req.params.binID}/latest`, {
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": process.env.X_MASTER_KEY
        }
    })
    res.json(response.data);
})

// for PUT request, the data is in req.body
app.put('/b/:binID', async function (req, res) {
    const response = await axios.put(
        `${process.env.JSON_BIN_URL}/b/${req.params.binID}`,
        req.body,
        {
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": process.env.X_MASTER_KEY
            }
        }
    )
    // must always send back a response
    console.log(response.data);
    res.json(response.data);
})

app.listen(3000, function () {
    console.log("server has started")
})