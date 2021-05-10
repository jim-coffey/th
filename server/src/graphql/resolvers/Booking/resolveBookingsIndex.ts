import { BookingsIndex } from '../../../lib/types';

// 2019-01-01   year: 2019 | month: 01 | day: 01
// 2019-01-02   year: 2019 | month: 01 | day: 02
// 2019-05-31   year: 2019 | month: 05 | day: 31
// 2019-06-01   year: 2019 | month: 06 | day: 01
// 2019-07-20   year: 2019 | month: 07 | day: 20

// NOTE: the JavaScript function for getting the month returns 0 for Jan ... and 11 for Dec
// Should resolve to:

// const bookingsIndex = {
//   "2019": {
//     "00": {
//       "01": true,
//       "02": true
//     },
//     "04": {
//       "31": true
//     },
//     "05": {
//       "01": true
//     },
//     "06": {
//       "20": true
//     }
//   }
// };

export const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };
  const checkOut = new Date(checkOutDate);
  let dateCursor = new Date(checkInDate);

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear(); // year
    const m = dateCursor.getUTCMonth(); // month
    const d = dateCursor.getUTCDate(); // day

    if (!newBookingsIndex[y]) {
      newBookingsIndex[y] = {};
    }

    if (!newBookingsIndex[y][m]) {
      newBookingsIndex[y][m] = {};
    }

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error(
        "selected dates can't overlap dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000);
  }

  return newBookingsIndex;
};
