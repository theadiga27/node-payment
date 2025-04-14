const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const Product = require("./model/productModel");
const Payment = require("./model/paymentModel");
const { razorpay } = require("./util/razorpay-credential");
const short = require("short-uuid");

exports.getProduct = async (_, res) => {
  try {
    const product = await Product.find();
   
    if (!product) {
      return res.status(400).json({
        status: "error",
        data: book,
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, image, price } = req.body;

    const product = await Product.create({ name, image, price });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
  }
};

exports.buyProduct = async (req, res) => {
  try {
    // if(!user){
    //   error()
    // }
    // if(!product){
    //   error()
    // }
    const receipt = short().new();

    const options = {
      amount: 5000 * 100,
      currency: "INR",
      receipt: receipt,
    };
    const data = await razorpay.orders.create(options);

    return res.status(201).json(data);
  } catch (e) {
    console.error(e);
  }
};

exports.webhook = async (req, res) => {
  const webhookBody = req.body;
  const webhookSignature = req.get("X-Razorpay-Signature");
  const webhookEventId = req.get("X-Razorpay-Event-Id");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (
    !validateWebhookSignature(
      JSON.stringify(webhookBody),
      webhookSignature,
      webhookSecret
    )
  ) {
    console.error("Validation Error");
    return res.status(400);
  }

  const payment = await Payment.find({ webhookEventId });
  if (payment.webhookEventId === webhookEventId) {
    console.error("duplicate webhook");
    return res.status(400);
  }

  const event = webhookBody.event;
  const paymentId = webhookBody.payload.payment.entity.id;
  const orderId = webhookBody.payload.payment.entity.order_id;
  const id = webhookBody.payload.payment.entity.notes.id;
  const receipt = webhookBody.payload.payment.entity.notes.receipt;

  if (!event || !paymentId || !orderId || !id || !receipt) {
    console.error(
      `Webhook Error: Missing event, orderId , id, paymentId, receipt`
    );
    return res.status(400);
  }

  if (event === "payment.captured") {
    console.log("SuccessFull");
    await Product.findByIdAndUpdate(id, {
      paid: true,
    });
  }
  if (event === "payment.failed") {
    console.log("Failed");
    await Product.findByIdAndUpdate(id, {
      paid: false,
    });
  }
  await Payment.create({
    productId: id,
    webhookEventId,
    event,
    paymentId,
    orderId,
    receipt,
  });

  return res.status(200);
};
