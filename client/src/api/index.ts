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
      checkIn {
        id: _id
        nOccupants
        roomIds
        inTime
        state
        customer {
          name
        }
        bill {
          billLog {
            amount
            createdAt
          }
          billPaid {
            amount
            createdAt
            mode
          }
        }
      }
    }
  }
`;

export const FETCH_ROOM = gql`
  query Room($id: [ID!]!) {
    room(id: $id) {
      id: _id
      displayName
      checkIn {
        state
      }
    }
  }
`;

export const FETCH_CHECKIN_BILL = gql`
  query CheckIn($id: ID!) {
    checkIn(id: $id) {
      id: _id
      nOccupants
      rooms {
        id: _id
        displayName
      }
      inTime
      state
      customer {
        name
      }
      bill {
        billLog {
          amount
          createdAt
        }
        billPaid {
          amount
          createdAt
          mode
        }
      }
    }
  }
`;

export const NEW_CHECK_IN = gql`
  mutation CheckIn(
    $name: String
    $address: String
    $contact: String
    $imagesIdFront: [String]
    $imagesIdBack: [String]
    $imageProfile: String
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
      imagesIdFront: $imagesIdFront
      imagesIdBack: $imagesIdBack
      imageProfile: $imageProfile
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
