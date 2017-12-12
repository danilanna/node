import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// set up a mongoose model
export default mongoose.model('Services', new Schema({ 
	api: { type: String},
	method: String,
	permissions: Array
}));