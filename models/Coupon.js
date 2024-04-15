import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

CouponSchema.virtual("isExpired").get(function() {
    return this.endDate < Date.now();
})

CouponSchema.virtual("daysLeft").get(function() {
    const daysLeft = Math.ceil((this.endDate - Date.now()) / ( 1000 * 60 * 60 * 24)) + "Days left"
    return daysLeft;
})

CouponSchema.pre("validate", function(next) {
    if (this.endDate < this.startDate) {
        next(new Error('Invalid end date'))
    }
    next();
});

CouponSchema.pre('validate', function(next) {
    if (this.startDate < Date.now()) {
        new Error('Start Date cannot be less than Today')
    }
    next();
}); 


CouponSchema.pre('validate', function(next) {
    if (this.endDate < Date.now()) {
        new Error('End Date cannot be greater than Today')
    }
    next();
}); 

CouponSchema.pre('validate', function(next) {
    if (this.discount <= 0 || this.discount > 100){
        next(new Error('Invalid discount'));
    }
    next();
});


const Coupon = mongoose.model('Coupon',CouponSchema);

export default Coupon;