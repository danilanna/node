import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

export default mongoose.model('Permission', new Schema({
  name: { type: String, index: { unique: true } },
  description: String,
}).plugin(mongoosePaginate));
