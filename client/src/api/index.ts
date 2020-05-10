import { gql } from 'apollo-boost';

// eslint-disable-next-line import/prefer-default-export
export const GET_ROOMS = gql`
  {
    rooms {
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
