import stripe from 'stripe';

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});

export const Stripe = {
  connect: async (code: string) => {
    // don't need access_token to take our own payments or anything else
    const { stripe_user_id } = await client.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    return stripe_user_id;
  },
};
