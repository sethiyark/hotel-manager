import { gql } from 'apollo-boost';

// eslint-disable-next-line import/prefer-default-export
export const GET_ROOMS = gql`
  {
    rooms {
      id: _id
      displayName
      floor
      config {
        western
        airConditioned
        priorityCleaned
      }
    }
  }
`;

export const FETCH_ROOM = gql`
  query Room($id: [ID!]!) {
    room(id: $id) {
      id: _id
      displayName
    }
  }
`;

export const NEW_CHECK_IN = gql`
  mutation CheckIn(
    $name: String
    $address: String
    $contact: String
    $inTime: String
    $nOccupants: Int
    $roomIds: [ID]
    $state: String
    $amount: Int
    $advance: Advance
  ) {
    newCheckIn(
      name: $name
      address: $address
      contact: $contact
      inTime: $inTime
      nOccupants: $nOccupants
      roomIds: $roomIds
      state: $state
      amount: $amount
      advance: $advance
    ) {
      id: _id
    }
  }
`;
