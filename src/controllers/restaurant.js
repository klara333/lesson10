import express from 'express'
import { ObjectId } from 'mongodb'

function createRestaurantsRouter(mongo){
    const router = express.Router()

    const db = mongo.db('lesson10')
    const collection = db.collection('restaurant')

    router.get('/', async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const perPage = 10
        const type = req.query.type || null
        const skip = (page - 1) * perPage

        const query = {}
        if (type) {
            query['type_of_food'] = type
        }

        const data = await collection
            .find(query)
            .limit(perPage)
            .skip(skip)
            .toArray()

        const count = await collection.countDocuments(query)

        res.json({data, count})
    })

    router.get('/', async (req, res) => {
        const data = await collection.find({}).limit(10).toArray()
        res.json(data)
    })
    router.get('/best-pizza-in-london', async (req, res) => {
        const query = {
            type_of_food: "Pizza",
            "address line 2": /London/,
            rating: {
                $gte: 6
            }
        }
        const data = await collection.find(query).limit(10).toArray()
        res.json(data)
    })

    router.get('/:id', async (req, res) => {
        const query = {
            _id: new ObjectId(req.params.id)
        }
        const data = await collection.findOne(query)
        res.json(data)
    })


    router.get('/in-london', async (req, res) => {
        const query = {
            "address line 2": /London/,
            rating: {
                $gte: 6
            }
        }
        const data = await collection.find(query).sort({rating: -1}).toArray()
        res.json(data)
    })

    router.delete('/', async (req, res) => {
    
        const query = {
            "address line 2": /Birmingham/,
            rating: {
                $lt: 3
            }
        };
    
        try {
            const result = await collection.deleteOne(query);
            res.json({ message: `${result.deletedCount} document deleted` });
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/add-restaurant', async (req, res) => {
        const newRestaurant = {
            address: "Hlavná",
            "address line 2": "Galanta",
            name: "Pizza del Corso",
            postcode: "92401",
            rating: 10,
            type_of_food: "Pizza"          
        }; 
    
        try {
            const result = await collection.insertOne(newRestaurant);
            res.json({ message: 'Document inserted successfully', insertedId: result.insertedId });
        } catch (error) {
            console.error('Error inserting document:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router
}

export default createRestaurantsRouter