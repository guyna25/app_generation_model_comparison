// Set dummy MONGODB_URI before any imports
// Integration tests use MongoMemoryServer with their own connection
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
