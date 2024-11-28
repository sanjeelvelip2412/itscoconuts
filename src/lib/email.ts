import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_your_id';
const EMAILJS_TEMPLATE_ID = 'template_your_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

export async function sendOrderConfirmationEmail(orderDetails: {
  buyerName: string;
  buyerEmail: string;
  orderItems: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  deliveryAddress: string;
  pincode: string;
}) {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_name: orderDetails.buyerName,
        to_email: orderDetails.buyerEmail,
        order_items: orderDetails.orderItems.map(item => 
          `${item.name} x${item.quantity} - ₹${item.price}`
        ).join('\n'),
        total_amount: `₹${orderDetails.total}`,
        delivery_address: orderDetails.deliveryAddress,
        pincode: orderDetails.pincode,
      },
      EMAILJS_PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}