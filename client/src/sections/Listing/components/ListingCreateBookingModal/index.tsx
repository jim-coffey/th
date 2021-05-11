import React from 'react';
import { Button, Divider, Modal, Typography } from 'antd';
import { KeyOutlined } from '@ant-design/icons/lib';
import {
  CardElement,
  injectStripe,
  ReactStripeElements,
} from 'react-stripe-elements';
import moment, { Moment } from 'moment';
import { formatPrice } from '../../../../lib/utils';

interface Props {
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

const ListingCreateBookingModal = ({
  price,
  checkInDate,
  checkOutDate,
  modalVisible,
  setModalVisible,
  stripe,
}: Props & ReactStripeElements.InjectedStripeProps) => {
  const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
  const bookingPrice = price * daysBooked;

  const handleCreateBooking = async () => {
    if (!stripe) {
      return;
    }

    let { token: stripeToken } = await stripe.createToken();
    console.log(stripeToken);
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-boooking-modal__intro-title">
            <KeyOutlined></KeyOutlined>
          </Title>
          <Title level={3} className="listing-boooking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{' '}
            <Text mark strong>
              {moment(checkInDate).format('MMMM Do YYYY')}
            </Text>{' '}
            and{' '}
            <Text mark strong>
              {moment(checkOutDate).format('MMMM Do YYYY')}
            </Text>
            , inclusive.
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatPrice(price, false)} x {daysBooked} days ={' '}
            <Text strong>{formatPrice(bookingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatPrice(bookingPrice, false)}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            hidePostalCode
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const WrappedListingCreateBookingModal = injectStripe(
  ListingCreateBookingModal
);
