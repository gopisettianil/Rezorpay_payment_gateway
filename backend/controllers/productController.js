import { instance } from "../server.js";  // Ensure correct path
import crypto from 'crypto';

export const processPayment = async (req, res) => {  // ✅ Add async
    try {
        const options = {
            amount: 1000, // Amount in paise (₹10.00)
            currency: "INR",
        };

        const order = await instance.orders.create(options); // ✅ Await inside async function

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Payment processing failed",
            error: error.message,
        });
    }
};

export const getKey=async(req,res)=>{
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })
}

export const paymentVerification=async(req,res)=>{
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature}=req.body
    const body= razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex');
    
    const isAunthentic=expectedSignature===razorpay_signature;
    if(isAunthentic){
        return res.redirect(`http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`)
    }else{
    res.status(404).json({
        success:false
    })
}
}