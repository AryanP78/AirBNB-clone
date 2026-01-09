const mongoose =require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");    


const MONGO_URL = "mongodb://127.0.0.1:27017/AirBNB"

main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async ()=>{
    await Listing.deleteMany({});

   initData.data = initData.data.map((obj)=>({...obj, owner:"695e1116dac0e5f3aaa39bb2"}))
    await Listing.insertMany(initData.data);
    console.log("data was initalized")

};

initDB();
