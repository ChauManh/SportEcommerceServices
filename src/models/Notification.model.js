const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    discount_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Discount'},
    notify_type: { type: String, enum: ['Khuyến mãi', 'Tình trạng đơn hàng', 'Tài khoản', 'Sản phẩm'], required: true },
    notify_title: { type: String, required: true },
    notify_desc: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    img: { type: String, required: false, default: null },
    redirect_url: { type: String, required: false, default: null }
  },
  {
    timestamps: true,
    collection: 'Notification'
  }
);

notificationSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
