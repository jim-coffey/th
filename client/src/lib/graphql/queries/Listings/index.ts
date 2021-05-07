import { gql } from 'apollo-boost';

export const LISTINGS = gql`
  query Listings($filter: ListingsFilter!, $limit: Int!, $page: Int!) {
    listings(filter: $filter, limit: $limit, page: $page) {
      total
      result {
        id
        title
        description
        image
        address
        price
        numOfGuests
      }
    }
  }
`;
