import { IResolvers } from 'apollo-server-express';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { authorize } from '../../../lib/utils';
import { Database, Listing, User } from '../../../lib/types';
import {
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsFilter,
  ListingsArgs,
  ListingsData,
} from './types';

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing | null> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });

        if (!listing) {
          throw new Error('listing can not be found');
        }

        const viewer = await authorize(db, req);
        if (viewer && viewer._id === listing.host) {
          listing.authorized = true;
        }

        return listing;
      } catch (err) {
        throw new Error(`Failed to query listing: ${err}`);
      }
    },
    listings: async (
      _root: undefined,
      { filter, limit, page }: ListingsArgs,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const data: ListingsData = {
          total: 0,
          result: [],
        };

        let cursor = await db.listings.find({});

        if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
          cursor = cursor.sort({ price: 1 });
        }

        if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
          cursor = cursor.sort({ price: -1 });
        }

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user listings: ${error}`);
      }
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    host: async (
      listing: Listing,
      __args: Record<string, unknown>,
      { db }: { db: Database }
    ): Promise<User | null> => {
      const host = await db.users.findOne({ _id: listing.host });

      if (!host) {
        throw new Error('host can not be found');
      }

      return host;
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex);
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: Database }
    ): Promise<ListingBookingsData | null> => {
      try {
        if (!listing.authorized) {
          return null;
        }

        const data: ListingBookingsData = {
          total: 0,
          result: [],
        };

        let cursor = await db.bookings.find({
          _id: { $in: listing.bookings },
        });

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (err) {
        throw new Error(`Failed to query listing bookings: ${err}`);
      }
    },
  },
};
