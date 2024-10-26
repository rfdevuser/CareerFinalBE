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
    status
    student
    submission_date
    working_professional
    year_of_experience
    
  }
}
`;


export const MY_TICKER = gql`
query MyQuery {
  tickerInfo
}
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetCandidateById($id: ID!) {
    candidateById(id: $id) {
      city
      id
      contact
      email
      name
      job_id
      gender
      passing_year
      qualification
      resume
      student
      working_professional
      year_of_experience
      submission_date
      
    }
  }
`;
export const GET_CANDIDATE_INTERNAL_INFO = gql`
  query GetCandidateInternalInfo($candidateID: String!) {
    getCandidateInternalInfo(candidateID: $candidateID) {
      candidateID
      candidateStatus
      noticePeriod
      availableToJoin
      presentCom
      expectedCom
      proposedCom
      created_at
    }
  }
`;


export const GET_CANDIDATE_HR_INFO = gql`
  query GetCandidateHRInfo($candidateID: String!) {
    getCandidateHRInfo(candidateID: $candidateID) {
      candidateID
      hrComment
      hrStatus
      created_at
    }
  }
`;
export const GET_INTERVIEWER_CANDIDATE_INFO = gql`
  query InterviewerCandidateInfoByID($candidateID: String!) {
    interviewerCandidateInfoByID(candidateID: $candidateID) {
      candidateID
      interviewerComment
      interviewerName
      interviewerStatus
      submissionTimestamp
    }
  }
`;



export const GET_CANDIDATES_BY_STATUS = gql`
  query GetCandidatesByStatus($status: String!) {
    getCandidatesByStatus(status: $status) {
    created_at
    candidateID
  
    expectedCom
    proposedCom
    }
  }
`;

export const CANDIDATE_INFO_NAME = gql`
query MyQuery {
  candidatesInfo {
   
   
 id
    name
   contact
    
  }
}
`;


export const GET_CANDIDATE_MULTIPLE_DETAILS = gql`
  query GetCandidateDetails($status: String!) {
    getMultipleQueryCandidatesByStatus(status: $status) {
      candidateID
      name
      interviewerStatus
       created_at
    }
  }
`;


export const GET_EMPLOYEE_MULTIPLE_DETAILS = gql`
  query GetEmployeeDetails($contact: String!) {
    employeeIDByContact(contact: $contact) {
      employeeID
     
    }
  }
`;
