const mongoose = require("mongoose");
const MongooseDelete = require("mongoose-delete");

const storeSchema = new mongoose.Schema(
  {
    // store_name: { type: String, required: true },
    store_banner: [{type: String}],
    store_address: {type: String, required: true},
    store_phone: {type: String, required: true},
    store_email: {type: String, require: true}
  },
  {
    timestamps: true,
    collection: "Store"
  },
);


const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
