const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const methodOverRide = require('method-override')
require('dotenv').config()
const MongoStore = require('connect-mongo')

const appRoutes = require('./routes/index.js')
const authRoutes = require('./routes/auth.js')
const reviewRoutes = require('./routes/reviews.js')

require('./config/passport.js')(passport)
const { formatDate, stripTags, truncate } = require('./helpers/hbs.js')


const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.engine('.hbs', exphbs({  helpers: { formatDate, stripTags, truncate }, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.use(methodOverRide((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.DB_CONNECTION
    })
}))
app.use(passport.initialize());
app.use(passport.session())


app.use('/', appRoutes)
app.use('/auth', authRoutes)
app.use('/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('login')
  })

const PORT = process.env.PORT || 3000
const DB_CONNECTION_URL = process.env.DB_CONNECTION

mongoose.connect(DB_CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))})
    .catch((err) => {console.log(err.message)})

mongoose.set('useFindAndModify', false) 
