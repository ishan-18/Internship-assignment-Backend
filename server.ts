import express, {Request, Response, Application} from 'express'
import mysql from 'mysql';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import {auth} from './middlewares/auth'

dotenv.config({
    path: './config/config.env'
})

const app: Application = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/users', require('./routes/users'))
app.use('/api/v1/posts', require('./routes/posts'))


export const connectionDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'intern_assignment'
})

connectionDB.connect(err => {
    if(err){
        console.error(`Error: ${err.stack}`)
    }

    console.log(`Database Connected...`, connectionDB.threadId)
})


app.get('/posts', auth, async (req: Request,res: Response) => {
    try {
        connectionDB.query('SELECT * FROM users', (err, results) => {
            if(err) throw err;
            res.status(200).json({results})
        })
    } catch (err) {
        return res.status(500).json({err})
    }
})


const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server Listening at http://localhost:${PORT}`)
})


