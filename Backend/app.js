import express from 'express';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors'
const app = express();
const port = 5000;
connectDB()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(taskRoutes);

app.get('/',(req,res)=>{
    res.send("Server is running")
})









app.listen(port,()=>{
    console.log(`app is running on http://localhost:${port}`)
})


