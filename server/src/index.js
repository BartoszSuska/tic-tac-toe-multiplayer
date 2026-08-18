import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import {StreamChat} from "stream-chat"
import {v4 as uuidv4} from "uuid"
import bcrypt from "bcrypt"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
const apikey = process.env.stream_api_key
const apisecret = process.env.stream_api_secret
const serverClient = StreamChat.getInstance(apikey, apisecret)

console.log("API Key exists:", !!apikey);
console.log("API Secret exists:", !!apisecret);

app.post("/signup", async (req, res) => {
    // Handle signup logic here
    try {
        const {firstName, lastName, username, password} = req.body
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createToken(userId);
        res.json({token, userId, firstName, lastName, username, hashedPassword})
    } catch (error) {
        res.json(error)
    }
})

app.post("/login", async (req, res) => {
    // Handle login logic here
    try{
            const {username, password} = req.body
        const {users} = await serverClient.queryUsers({name: username})
        if (users.length === 0) { return res.json({message: "User not found"})}

        const token = serverClient.createToken(users[0].id)
        const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword)
        
        if(passwordMatch){
            res.json({
                token, 
                firstName: users[0].firstName, 
                lastName: users[0].lastName,
                username,
                userId: users[0].id,
            })
        }
    } catch (error) {
        res.json(error)
    }

})

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})