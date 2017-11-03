import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// set up a mongoose model
export default mongoose.model('User', new Schema({ 
	name: { type: String, index: { unique: true }},
	password: String,
	admin: Boolean 
}));