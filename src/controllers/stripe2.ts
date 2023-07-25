import Stripe from 'stripe';

const stripe = new Stripe('YOUR_SECRET_KEY', {
  apiVersion: '2022-11-15'
});

const createPaymentLink = async (amount: number, currency: string): Promise<string> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency
    });

    const confirmParams: Stripe.PaymentIntentConfirmParams = {
      payment_method: paymentIntent.payment_method as any
    };

    

    const paymentIntentClientSecret = paymentIntent.client_secret;
    const paymentLink = await stripe.paymentIntents.createPaymentLink(paymentIntentClientSecret, { confirm: confirmParams });

    return paymentLink.url;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to create payment link');
  }
};

// Example usage
const paymentLink = await createPaymentLink(10000, 'usd');
console.log(paymentLink);
