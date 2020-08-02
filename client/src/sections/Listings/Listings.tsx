import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
import {
  Listings_listings as Listing,
  Listings as ListingsData,
} from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";

interface Props {
  title: string;
}

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listingsList =
    data &&
    data.listings.map((listing: Listing) => (
      <li key={listing.id}>
        {listing.title}
        <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
      </li>
    ));

  return (
    <div>
      <h2>{title}</h2>
      {(loading || deleteListingLoading) && <h3>Busy...</h3>}
      {(error || deleteListingError) && (
        <h3>Uh oh! Something went wrong - please try again later :(</h3>
      )}
      <ul>{listingsList}</ul>
    </div>
  );
};
