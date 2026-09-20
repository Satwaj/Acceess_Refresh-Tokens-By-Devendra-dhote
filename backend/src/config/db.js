import mongoose from "mongoose"


export const connectToDB = async () => {
  try {

    await mongoose.connect("mongodb+srv://satwajbachhav2004_db_user:iQofJORv198ERRVd@cluster0.jbwqyjo.mongodb.net/AR_Tokens")
    console.log("mongoDb Connected")

  } catch (error) {

    console.log("error in Db", error)
  }
}
