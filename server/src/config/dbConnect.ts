import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string)
  } catch (error) {
    console.error(error)
  }
}

export default connectDB
