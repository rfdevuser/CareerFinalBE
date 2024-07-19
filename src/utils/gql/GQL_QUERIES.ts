import { gql } from '@apollo/client';

export const CANDIDATE_INFO = gql`
query MyQuery {
  candidatesInfo {
    answer1
    answer2
    answer3
    answer5
    answer4
    city
    contact
    email
    gender
    id
    job_id
    name
    passing_year
    qualification
    resume
    student
    submission_date
    working_professional
    year_of_experience
  }
}
`;


export const MY_TICKER = gql `
query MyQuery {
  tickerInfo
}
`;