import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({ 
	name: { type: String, index: { unique: true }},
	email: { type: String, index: { unique: true }},
	password: String,
	admin: Boolean,
	permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}).plugin(mongoosePaginate));