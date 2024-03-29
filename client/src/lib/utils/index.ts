import { message, notification } from 'antd';

export const iconColor = '#1890ff';

export const formatPrice = (price: number, round = true) => {
  const formattedListingPrice = round ? Math.round(price / 100) : price / 100;

  return `$${formattedListingPrice}`;
};

export const displaySuccessNotification = (
  message: string,
  description?: string
) =>
  notification['success']({
    message,
    description,
    placement: 'topLeft',
    style: {
      marginTop: 50,
    },
  });

export const displayErrorMessage = (error: string) => message.error(error);
