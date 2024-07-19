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