const mongoose = require("mongoose");
const MongooseDelete = require("mongoose-delete");

const discountSchema = new mongoose.Schema(
  {
    discount_title: { type: String, required: true },
    discount_code: { type: String, required: true},
    discount_type: {
      type: String,
      enum: ["shipping", "product"],
      required: true,
    },
    discount_start_day: { type: Date, required: true  },
    discount_end_day: { type: Date, required: true  },
    discount_amount: { type: Number, required: true  },
    // is_displayed: { type: Boolean, default: false },
    discount_number: { type: Number, required: true }, // phần trăm giảm giá
    //1 mảng product
    //1 mảng category
    //giá đơn hàng tối thiểu 
    //decription
    applicable_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicable_categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    min_order_value: { type: Number, default: 0 },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "expired", "upcoming"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "Discount"
  },
);

discountSchema.pre("save", function (next) {
  const now = new Date();

  if (this.discount_amount <= 0 || now > this.discount_end_day) {
    this.status = "expired";
  }

  next();
});

discountSchema.pre("findOneAndUpdate", function (next) {
  const now = new Date();
  const update = this.getUpdate();

  if (update) {
    if ((update.discount_amount !== undefined && update.discount_amount <= 0) || 
        (update.discount_end_day !== undefined && now > update.discount_end_day)) {
      this.set({ status: "expired" });
    }
  }

  next();
});

discountSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
