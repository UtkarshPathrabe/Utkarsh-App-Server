import mongoose from "mongoose";

const serverStatus = () => {
  return mongoose.STATES[mongoose.connection.readyState];
};

let connectedTo = '';
let databaseName = '';

const connectToDB = async (url, dbName) => {
  try {
    if (serverStatus() === 'connected') {
      if (connectedTo === url) {
        console.info('=> using existing database connection for ' + dbName);
        return;
      }
      else {
        await mongoose.disconnect();
        connectedTo = '';
        console.info(`Connection to ${databaseName} DB terminated.`);
        databaseName = '';
      }
    }
    mongoose.set('strictQuery', true);
    await mongoose.connect(url);
    connectedTo = url;
    databaseName = dbName;
    console.info(`MongoDB connected to ${dbName}.`);
  }
  catch (error) {
    console.error('connectToDB', error);
  }
};

export default connectToDB;