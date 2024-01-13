import { MongoClient } from 'mongodb'

export default class Mongo {
    static connect() {
        return new MongoClient(process.env.MONGO_URL)
    }
}