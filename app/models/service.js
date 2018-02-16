import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

export default mongoose.model('Service', new Schema({ 
	api: String,
	method: String,
	permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}).plugin(mongoosePaginate));