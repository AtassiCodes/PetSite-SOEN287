// Imports and setup
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const app = express();
const port = 3000;

// Session configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

// Set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { username: req.session.username });
});

app.get('/contact', (req, res) => {
    res.render('contact', { username: req.session.username })
})

app.get('/cat-care', (req, res) => {
    res.render('cat-care', { username: req.session.username })
})

app.get('/dog-care', (req, res) => {
    res.render('dog-care', { username: req.session.username })
})

app.get('/find', (req, res) => {
    res.render('find', { username: req.session.username })
})

app.get('/find-results', (req, res) => {
    res.render('find-results', { username: req.session.username })
})

app.get('/give-away', (req, res) => {
    res.render('give-away', { username: req.session.username })
})

// Function to read login data from file
function readLoginData() {
    return fs.readFileSync('login.txt', 'utf8').split('\n').map(line => {
        const [username, password] = line.split(':');
        return { username, password };
    });
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { username: req.session.username });
});

app.get('/login', (req, res) => {
    if (req.session.username) {
        res.send(`Welcome back, ${req.session.username}! <a href="/logout">Logout</a>`);
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readLoginData();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.username = username;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid username or password.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            res.redirect('/');
        }
    });
});

app.post('/register', (req, res) => {
    const { newUsername, newPassword } = req.body;
    const users = readLoginData();
    const exists = users.some(u => u.username === newUsername);
    if (exists) {
        res.status(400).send('Username already exists.');
    } else {
        fs.appendFileSync('login.txt', `${newUsername}:${newPassword}\n`);
        res.redirect('/');
    }
});
// Route for handling the login and form submission
app.post('/give-away', (req, res) => {
    console.log(req.body)
    //console.log(res)

if (req.body['compatibility-dogs'] == undefined) {
    req.body['compatibility-dogs'] = false
} 
if (req.body['compatibility-cats'] == undefined) {
    req.body['compatibility-cats'] = false
} 
if (req.body['compatibility-children'] == undefined) {
    req.body['compatibility-children'] = false
} 

    const { petType, breed, age, gender, ownerName, ownerEmail, username, password } = req.body;
console.log(petType, breed, age, gender, req.body['compatibility-dogs'])
    // Check if user is logged in
    if (!req.session.username) {
        return res.status(401).send('You must be logged in to submit a pet giveaway.');
    }

    // Save pet information to the available pet information file
    const petInfo = `${petType}:${breed}:${age}:${gender}:${ownerName}:${ownerEmail}`;
    fs.appendFileSync('available-pets.txt', petInfo + '\n');

    // Redirect or send success response
    res.send('Pet information added successfully!');
});

app.post('/find-pets', (req, res) => {

    // Get form inputs
    const petType = req.body['pet-type'];
    const breed = req.body.breed && typeof req.body.breed === 'string' ? req.body.breed.toLowerCase() : '';

    const age = req.body.age;
    const gender = req.body.gender;
    if (req.body['compatibility-dogs'] == undefined) {
        req.body['compatibility-dogs'] = false
    } 
    if (req.body['compatibility-cats'] == undefined) {
        req.body['compatibility-cats'] = false
    } 
    if (req.body['compatibility-children'] == undefined) {
        req.body['compatibility-children'] = false
    } 

    // Read available pets data from file
    const availablePets = fs.readFileSync('available-pets.txt', 'utf8').split('\n');
    
    // Filter pets based on form inputs
    const filteredPets = availablePets.filter(petInfo => {
        const [type, petBreed, petAge, petGender, _, __] = petInfo.split(':');
        return type.toLowerCase() === petType.toLowerCase() &&
               petBreed.toLowerCase() === breed.toLowerCase() &&
               (age === 'any' || petAge.toLowerCase() === age.toLowerCase()) &&
               (gender === 'any' || petGender.toLowerCase() === gender.toLowerCase()) &&
               (compatibilityDogs ? _ : true) &&
               (compatibilityCats ? __ : true) &&
               (compatibilityChildren ? ___ : true);
    });
    
    // Pass filtered pets and username to the find-results.ejs template
    res.render('find-results', { filteredPets, username: req.session.username });
    console.log("===============================================")
    console.log(req.body)
    console.log(res)
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});