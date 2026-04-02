import { gql } from "graphql-request";

const citiesQuery = gql`
  {
    parserSetting {
      data {
        id
        attributes {
          cities
        }
      }
    }
  }
`;

export default citiesQuery;
