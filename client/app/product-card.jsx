"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(new Error("Something is not right!"));
    };
    document.body.appendChild(script);
  });
}

function ProductCard({ cards }) {
  const router = useRouter();
  const onClick = async (e, card) => {
    e.preventDefault();
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        window.alert("Razorpay SDK failed to load. Are you online?");
      }

      const { data } = await axios.get(`http://localhost:5000/buy`);

      if (!data || !data.id || data.status != "created") {
        return window.alert("order is not created");
      }
      const options = {
        key: `${process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID}`,
        amount: `${data.amount}`,
        currency: `${data.currency}`,
        name: card.name,
        description: "Test Transaction",
        image: card.image,
        order_id: `${data.id}`,
        handler: function (response) {
          window.alert("Payment Sucessfull");
          router.refresh();
        },
        notes: {
          id: card._id,
          receipt: data.receipt,
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on("payment.failed", function (response) {
        window.alert("Payment Failed");
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {cards.map((card) => (
        <div className="" key={card._id}>
          <Image
            className=""
            src={card.image}
            alt={card.name}
            width={300}
            height={600}
          />
          <h2 className="text-2xl font-bold mt-3 mb-2">{card.name}</h2>
          <p className="text-lg mb-4">₹{card.price}</p>

          <button
            onClick={(e) => onClick(e, card)}
            disabled={card.paid ? true : false}
            className={`bg-blue-900 text-blue-100 px-6 py-2 rounded-md ${
              card.paid
                ? "cursor-not-allowed bg-red-800"
                : "hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {card.paid ? "Sold" : "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductCard;
