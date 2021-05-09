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
};
