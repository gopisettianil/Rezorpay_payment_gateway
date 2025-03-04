import React from "react";
import axios from "axios";
import "../styles/Products.css";

function Products({ products }) {
    const checkoutHandler = async (amount) => {
        try {
            // Fetch Razorpay key
            const { data } = await axios.get("/api/v1/getKey");
            const key = data.key; // Ensure the API returns { key: "your_public_key" }

            // Create Order
            const { data: orderData } = await axios.post("/api/v1/payment/process", {
                amount: amount * 100,  // Convert to paise
            });

            const { order } = orderData;
            console.log(order);

            // Load Razorpay dynamically
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key,
                    amount: amount * 100, // Amount in paise
                    currency: "INR",
                    name: "Shopper",
                    description: "Razorpay Integration",
                    order_id: order.id,
                    callback_url: "/api/v1/paymentVerification",
                    prefill: {
                        name: "Anil",
                        email: "anilkumar1456601@gmail.com",
                        contact: "9000486841",
                    },
                    theme: {
                        color: "#F37254",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            };
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <div className="products-container">
            {products.map((item) => (
                <div className="product-card" key={item.id}>
                    <img src={item.image} alt={item.title} className="product-image" />
                    <h3 className="product-title">{item.title}</h3>
                    <p className="product-price">
                        Price <strong>{item.price}</strong>/-
                    </p>
                    <button className="pay-button" onClick={() => checkoutHandler(item.price)}>
                        Pay ({item.price})/-
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Products;
