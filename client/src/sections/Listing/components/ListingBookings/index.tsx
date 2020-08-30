import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Divider, List, Typography } from 'antd';
import { Listing } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';

interface Props {
  listingBookings: Listing['listing']['bookings'];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

const { Title, Text } = Typography;

export const ListingBookings = ({
  listingBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const total = listingBookings ? listingBookings.total : null;
  const result = listingBookings ? listingBookings.result : null;

  const listingBookingsList = listingBookings ? (
    <List
      grid={{
        gutter: 36,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 3,
      }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: 'No bookings have been made yet.' }}
      pagination={{
        position: 'top',
        current: bookingsPage,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setBookingsPage(page),
      }}
      renderItem={listingBooking => {
        const bookingHistory = (
          <div className="listing-bookings__booking-history">
            <div>
              Check In: <Text strong>{listingBooking.checkIn}</Text>
            </div>
            <div>
              Check Out: <Text strong>{listingBooking.checkOut}</Text>
            </div>
          </div>
        );

        return (
          <List.Item>
            {bookingHistory}
            <Link to={`/user/${listingBooking.tenant.id}`}>
              <Avatar
                src={listingBooking.tenant.avatar}
                size={64}
                shape="square"
              />
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  const listingBookingsElement = listingBookingsList ? (
    <div className="listing-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Title level={4} className="listing-bookings__title">
          Bookings
        </Title>
        {listingBookingsList}
      </div>
    </div>
  ) : null;

  return listingBookingsElement;
};
