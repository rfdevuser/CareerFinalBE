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



// Define the GraphQL query to fetch employee data
export const GET_EMPLOYEES = gql`
  query {
    employeeIDGeneratorAllEmployees {
      contact
      dept
      email
      employeeID
      name
      password
    }
  }
`;

export const GET_EMPLOYEE_PERSONAL_DETAILS = gql`
  query GetEmployeePersonalDetails($employeeID: String!) {
    getEmployeeDetailsByEmployeeID(employeeID: $employeeID) {
      add_contact
      add_email
      age
      blood
      contact
      department
      dob
      email
      emergencyContact1
      emergencyContact2
      emergencyName1
      emergencyName2
      emergencyRelation1
      emergencyRelation2
      employeeID
      gender
      marital
      name
    }
  }
`;




export const GET_EMPLOYEE_ADDRESS = gql`
  query GetEmployeeAddress($employeeID: String!) {
    getEmployeeAddressByEmployeeID(employeeID: $employeeID) {
      employeeID
      id
      paddress1
      paddress2
      pcity
      pcountry
      ppin
      pstate
      taddress1
      taddress2
      tcity
      tcountry
      tpin
      tstate
    }
  }
`;

export const GET_EMPLOYEE_QUALIFICATIONS = gql`
  query GetEmployeeQualifications($employeeID: String!) {
    employeeQualifications(employeeID: $employeeID) {
      institutename
      percentage
      qualification
      university
      yop
    }
  }
`;


export const GET_EMPLOYEE_FAMILY = gql`
  query GetEmployeeFamily($employeeID: String!) {
    employeeFamily(employeeID: $employeeID) {
      age
      contact
      employeeID
      id
      name
      occupation
      relation
    }
  }
`;

export const GET_EMPLOYEE_HISTORY = gql`
  query GetEmployeeHistory($employeeID: String!) {
    employeeHistory(employeeID: $employeeID) {
      companyname
      designation
      employeeID
      id
      lastsalary
      location
      periodfrom
      periodto
      reasonofleave
      referencepersoncontact
      referencepersonname
    }
  }
`;


export const GET_EMPLOYEE_EXTRA_DETAILS = gql`
  query GetEmployeeExtraDetails($employeeID: String!) {
    employeeExtraDetails(employeeID: $employeeID) {
    aadhar
    drivinglicense
    drivinglicenseexpiry
    employeeID
    pan
    }
  }
`;


export const GET_EMPLOYEE_SKILLS = gql`
  query GetEmployeeSkills($employeeID: String!) {
    employeeSkills(employeeID: $employeeID) {
      certificate
      employeeID
      experience
      id
      skillname
    }
  }
`;


export const GET_EMPLOYEE_LANGUAGE = gql`
  query GetEmployeeLanguage($employeeID: String!) {
    getEmployeeLanguage(employeeID: $employeeID) {
      languageName
      proficiency
    }
  }
`;



export const GET_EMPLOYEE_VERIFICATION = gql`
  query GetEmployeeVerification($employeeID: String!) {
    employeeVerificationByID(empID: $employeeID) {
      empID
      idPrimary
      submittedAt
      verificationStatus
    }
  }
`;