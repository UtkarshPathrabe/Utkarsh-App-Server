import mongoose from "mongoose";

const serverStatus = () => {
  return mongoose.STATES[mongoose.connection.readyState];
};

let connectedTo = '';

const connectToDB = async (url, dbName) => {
  try {
    if (serverStatus() === mongoose.ConnectionStates.connected) {
      if (connectedTo === url) {
        return console.info('=> using existing database connection for ' + dbName);
      }
      else {
        await mongoose.disconnect();
        connectedTo = '';
        console.info('Connection to another DB terminated.');
      }
    }
    mongoose.set('strictQuery', true);
    await mongoose.connect(url);
    connectedTo = url;
    console.info(`MongoDB connected to ${dbName}.`);
  }
  catch (error) {
    console.error('connectToDB', error);
  }
};

export default connectToDB;