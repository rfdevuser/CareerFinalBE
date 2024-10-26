import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

export const ADD_JOB_INFO = gql`
  mutation AddJob(
  $jobId:String!
    $jobTitle: String!,
    $jobBrief: String!,
    $jobResponsibility: String!,
    $jobRequirement: String!,
    $jobSalary: String!,
    $jobLocation: String!,
    $question1: String!,
    $question2: String!,
    $question3: String!,
    $question4: String!,
    $question5: String!,
  ) {
  addjobinfo(input: {
      job_id: $jobId
      job_title: $jobTitle,
      job_brief: $jobBrief,
      job_responsibility: $jobResponsibility,
      job_requirement: $jobRequirement,
      job_salary: $jobSalary,
      job_location: $jobLocation,
      question1: $question1,
      question2: $question2,
      question3: $question3,
      question4: $question4,
      question5: $question5,
      clientMutationId: "test"
    }) {
    clientMutationId
    message
  }
  }
`;


export const Add_TICKER = gql`
mutation AddTicker(
$name: String!
){
addticker(input:{
name: $name,
 clientMutationId: "test"
}){
 testoutput
 }
}
`;


export const DELETE_TICKER = gql`
mutation DeleteTicker(
$name: String!
)
{

  deleteticker(input: {clientMutationId: "Test", name: $name}) {
 
    testoutput
  }


}`;

export const DELETE_CANDIDATE_RESPONSE = gql`
mutation MyMutation(
$contact: String!
) {
 
  deleteCandidateResponse(input: {clientMutationId: "Test", contact: $contact}) {
    clientMutationId
    testOutput
  }
}
  `;


  export const DELETE_JOBS = gql`
  mutation MyMutation(
  $job_id: String!
  ) {
  deleteJob(input: {clientMutationId: "", jobId: $job_id}) {
    clientMutationId
    testOutput
  }
}
  `;

  export const UPDATE_CANDIDATE_STATUS  =gql`
  mutation UpdateCandidateStatus(
    $id: String!,
    $status: String!
  ) {
    updateCandidateStatus(
      input: {
        id: $id,
        status: $status,
        clientMutationId: "test"
      }
    ) {
      clientMutationId
      message
    }
  }
  `;




  export const ADD_CANDIDATE_INTERNAL_INFO = gql`
  mutation UpdateAddCandidateInternalInfo(
    $candidateID: String!,
    
    $candidateStatus: String!,
    $noticePeriod: String!,
    $availableToJoin: String!,
    $presentCom: String!,
    $expectedCom: String!,
    $proposedCom: String!
  ) {
    addCandidateInternalInfo(input: {
      candidateID:     $candidateID,
      candidateStatus:  $candidateStatus,
      noticePeriod: $noticePeriod,
      availableToJoin: $availableToJoin,
      presentCom: $presentCom,
      expectedCom: $expectedCom,
      proposedCom: $proposedCom,
     
    }) {
     testoutput
 
    }
  }
`;
export const ADD_CANDIDATE_HR_INFO = gql`
  mutation AddCandidateHRInfo(
    $candidateID: String!,
    $hrComment: String!,
    $hrStatus: String!
  ) {
    addCandidateHRInfo(input: {
      candidateID: $candidateID,
      hrComment: $hrComment,
      hrStatus: $hrStatus
    }) {
      responseMessage
    }
  }
`;



export const ADD_INTERVIEWER_CANDIDATE_INFO = gql`
  mutation AddInterviewerCandidateInfo(
    $candidateID: String!,
    $interviewerName: String!,
    $interviewerComment: String!,
    $interviewerStatus: String!
  ) {
    addInterviewerCandidateInfo(input: {
      candidateID: $candidateID,
      interviewerName: $interviewerName,
      interviewerComment: $interviewerComment,
      interviewerStatus: $interviewerStatus
    }) {
     testoutput
    }
  }
`;





export const INSERT_EMPLOYEE = gql`
  mutation InsertEmployee(
    $dept: String!,
    $contact: String!,
    $email: String!,
    $name: String!,
    $password: String!
  ) {
    employeeIDGeneratorInsertEmployee( input:{
    clientMutationId: "test"
     
      contact: $contact,
       dept: $dept,
      email: $email,
      name: $name,
      password: $password
}){
        clientMutationId
    employeeID
    password
    }
  }
`;
