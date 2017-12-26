import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// set up a mongoose model
export default mongoose.model('Service', new Schema({ 
	api: String,
	method: String,
	permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}));