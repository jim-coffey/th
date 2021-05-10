import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
  typescript: true,
});

export const StripeApi = {
  connect: async (code: string) => {
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await stripe.charges.create(
      {
        amount,
        currency: 'usd',
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripeAccount,
      }
    );

    if (res.status !== 'succeeded') {
      throw new Error('failed to create charge with Stripe');
    }
  },
};
