import dotenv from 'dotenv'
import express from 'express'
import indexController from './controllers/index.js'
import createRestaurantsRouter from './controllers/restaurant.js'
import exceptionHandler from './middleware/exception_handler.js'
import Mongo from './services/mongo.js'

dotenv.config()

async function run() {
    const app = express()
    app.use(express.json());

    const mongo = Mongo.connect()

    app.use('/restaurants', createRestaurantsRouter(mongo))
    app.use('/', indexController)
    app.use(exceptionHandler)


    app.listen(process.env.PORT, process.env.HOST, () => {
        console.log(`Server listening on http://${process.env.HOST}:${process.env.PORT}`)
    })
}

run()