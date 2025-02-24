const mongoose = require("mongoose");

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
    is_displayed: { type: Boolean, default: false },
    discount_number: { type: Number, required: true }, // phần trăm giảm giá
    discount_condition: {type: String}
    // [
    //   {
    //     price_total_order: { type: Number, required: true },
    //     category_id: [{
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Category",
    //       default: null,
    //       required: true
    //     },
    //     ],
    //     _id: false
    //   }
    // ]
  },
  {
    timestamps: true,
    collection: "Discount"
  },
);

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
