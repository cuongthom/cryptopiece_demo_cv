import mongoose from "mongoose";

export const connectDB = async () => {
  const connectionStr = Bun.env.MONGO_URI_DEV;
  try {
    if (connectionStr !== undefined) {
      const conn = await mongoose.connect(connectionStr, {
        autoIndex: true,
      });

      console.log(`MongoDB Connected : ${conn?.connection?.name}`);
    }
  } catch (err: any) {
    console.log(err);
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
