"use client";
import { GET_EMPLOYEE_PERSONAL_DETAILS, GET_EMPLOYEE_ADDRESS, GET_EMPLOYEE_QUALIFICATIONS, GET_EMPLOYEE_FAMILY, GET_EMPLOYEE_EXTRA_DETAILS, GET_EMPLOYEE_HISTORY, GET_EMPLOYEE_SKILLS, GET_EMPLOYEE_LANGUAGE } from '@/utils/gql/GQL_QUERIES';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import React, { useState } from 'react';

interface EmployeeFamily {
  id: string;
  employeeID: string;
  name: string;
  relation: string;
  age: string;
  contact: string;
  occupation: string;
}

interface EmployeeQualification {
  institutename: string;
  percentage: string;
  qualification: string;
  university: string;
  yop: string;
}

interface EmployeeAddress {
  paddress1: string;
  paddress2: string;
  pcity: string;
  pstate: string;
  pcountry: string;
  ppin: string;
  taddress1: string;
  taddress2: string;
  tcity: string;
  tstate: string;
  tcountry: string;
  tpin: string;
}

interface EmployeePersonalDetails {
  employeeID: string;
  name: string;
  email: string;
  contact: string;
  add_contact: string;
  age: string;
  blood: string;
  dob: string;
  gender: string;
  marital: string;
  emergencyName1: string;
  emergencyRelation1: string;
  emergencyContact1: string;
  emergencyName2: string;
  emergencyRelation2: string;
  emergencyContact2: string;
}

const Page = ({ params }: { params: { id: string } }) => {
  const [showDetails, setShowDetails] = useState({
    personalInfo: false,
    address: false,
    qualification: false,
    family: false,
    employmentHistory: false,
    skills: false,
    languages: false,
    documents: false,
  });

  // GraphQL Queries
  const { loading: loadingPersonalInfo, data: dataPersonalInfo, error: errorPersonalInfo } = useQuery(GET_EMPLOYEE_PERSONAL_DETAILS, { variables: { employeeID: params.id } });
  const { loading: loadingAddress, data: dataAddress, error: errorAddress } = useQuery(GET_EMPLOYEE_ADDRESS, { variables: { employeeID: params.id } });
  const { loading: loadingQualification, data: dataQualification, error: errorQualification } = useQuery(GET_EMPLOYEE_QUALIFICATIONS, { variables: { employeeID: params.id } });
  const { loading: loadingFamily, data: dataFamily, error: errorFamily } = useQuery(GET_EMPLOYEE_FAMILY, { variables: { employeeID: params.id } });
  const { loading: loadingEmploymentHistory, data: dataEmploymentHistory, error: errorEmploymentHistory } = useQuery(GET_EMPLOYEE_HISTORY, { variables: { employeeID: params.id } });
  const { loading: loadingSkills, data: dataSkills, error: errorSkills } = useQuery(GET_EMPLOYEE_SKILLS, { variables: { employeeID: params.id } });
  const { loading: loadingLanguages, data: dataLanguages, error: errorLanguages } = useQuery(GET_EMPLOYEE_LANGUAGE, { variables: { employeeID: params.id } });

  const toggleSection = (section: string) => {
    setShowDetails((prevState: any) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Render Personal Info
  const renderPersonalInfo = () => {
    if (loadingPersonalInfo) return <div>Loading Personal Info...</div>;
    if (errorPersonalInfo) return <div>Error: {errorPersonalInfo.message}</div>;
    if (dataPersonalInfo) {
      const employee: EmployeePersonalDetails = dataPersonalInfo.getEmployeeDetailsByEmployeeID;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Personal Information</h3>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Employee ID:</strong> {employee.employeeID}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Contact:</strong> {employee.contact}</p>
          <p><strong>Additional Contact:</strong> {employee.add_contact}</p>
          <p><strong>Age:</strong> {employee.age}</p>
          <p><strong>Blood Type:</strong> {employee.blood}</p>
          <p><strong>Date of Birth:</strong> {employee.dob}</p>
          <p><strong>Gender:</strong> {employee.gender}</p>
          <p><strong>Marital Status:</strong> {employee.marital}</p>

          <h4 className="font-semibold mt-4">Emergency Contacts</h4>
          <p><strong>Contact 1:</strong> {employee.emergencyName1} ({employee.emergencyRelation1}) - {employee.emergencyContact1}</p>
          <p><strong>Contact 2:</strong> {employee.emergencyName2} ({employee.emergencyRelation2}) - {employee.emergencyContact2}</p>
        </div>
      );
    }
    return null;
  };

  // Render Address
  const renderAddress = () => {
    if (loadingAddress) return <div>Loading Address...</div>;
    if (errorAddress) return <div>Error: {errorAddress.message}</div>;
    if (dataAddress) {
      const address: EmployeeAddress = dataAddress.getEmployeeAddressByEmployeeID;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Address</h3>
          
          <h4 className="font-semibold">Permanent Address</h4>
          <p><strong>Address Line 1:</strong> {address.paddress1}</p>
          <p><strong>Address Line 2:</strong> {address.paddress2}</p>
          <p><strong>City:</strong> {address.pcity}</p>
          <p><strong>State:</strong> {address.pstate}</p>
          <p><strong>Country:</strong> {address.pcountry}</p>
          <p><strong>Pin Code:</strong> {address.ppin}</p>
          
          <h4 className="font-semibold">Temporary Address</h4>
          <p><strong>Address Line 1:</strong> {address.taddress1}</p>
          <p><strong>Address Line 2:</strong> {address.taddress2}</p>
          <p><strong>City:</strong> {address.tcity}</p>
          <p><strong>State:</strong> {address.tstate}</p>
          <p><strong>Country:</strong> {address.tcountry}</p>
          <p><strong>Pin Code:</strong> {address.tpin}</p>
        </div>
      );
    }
    return null;
  };

  // Render Qualification
  const renderQualification = () => {
    if (loadingQualification) return <div>Loading Qualification...</div>;
    if (errorQualification) return <div>Error: {errorQualification.message}</div>;
    if (dataQualification) {
      const qualifications: EmployeeQualification[] = dataQualification.employeeQualifications;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Qualifications</h3>
          {qualifications.length > 0 ? (
            qualifications.map((qualification: EmployeeQualification, index: number) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="text-lg font-semibold">{qualification.qualification} ({qualification.yop})</h4>
                <p><strong>Institution:</strong> {qualification.institutename}</p>
                <p><strong>University:</strong> {qualification.university}</p>
                <p><strong>Percentage/CGPA:</strong> {qualification.percentage}</p>
                <p><strong>Year of Passing:</strong> {qualification.yop}</p>
              </div>
            ))
          ) : (
            <p>No qualifications available.</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render Family
  const renderFamily = () => {
    if (loadingFamily) return <div>Loading Family...</div>;
    if (errorFamily) return <div>Error: {errorFamily.message}</div>;
    if (dataFamily) {
      const familyMembers: EmployeeFamily[] = dataFamily.employeeFamily;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Family</h3>
          {familyMembers.length > 0 ? (
            familyMembers.map((family: EmployeeFamily, index: number) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="text-lg font-semibold">{family.relation}: {family.name}</h4>
                <p><strong>Age:</strong> {family.age}</p>
                <p><strong>Contact:</strong> {family.contact}</p>
                <p><strong>Occupation:</strong> {family.occupation}</p>
              </div>
            ))
          ) : (
            <p>No family members available.</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render Employment History
  const renderEmploymentHistory = () => {
    if (loadingEmploymentHistory) return <div>Loading Employment History...</div>;
    if (errorEmploymentHistory) return <div>Error: {errorEmploymentHistory.message}</div>;
    if (dataEmploymentHistory) {
      const employmentHistory = dataEmploymentHistory.employeeHistory;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Employment History</h3>
          {employmentHistory.length > 0 ? (
            employmentHistory.map((history: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="text-lg font-semibold">{history.companyname} ({history.periodfrom} - {history.periodto})</h4>
                <p><strong>Designation:</strong> {history.designation}</p>
                <p><strong>Location:</strong> {history.location}</p>
                <p><strong>Last Salary:</strong> {history.lastsalary}</p>
                <p><strong>Reason for Leave:</strong> {history.reasonofleave}</p>
                <p><strong>Reference Person:</strong> {history.referencepersonname} ({history.referencepersoncontact})</p>
              </div>
            ))
          ) : (
            <p>No employment history available.</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render Skills
  const renderSkills = () => {
    if (loadingSkills) return <div>Loading Skills...</div>;
    if (errorSkills) return <div>Error: {errorSkills.message}</div>;
    if (dataSkills) {
      const skills = dataSkills.employeeSkills;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Skills</h3>
          {skills.length > 0 ? (
            skills.map((skill: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="text-lg font-semibold">{skill.skillname} ({skill.experience} years)</h4>
                <p><strong>Certificate:</strong> {skill.certificate}</p>
              </div>
            ))
          ) : (
            <p>No skills available.</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render Languages
  const renderLanguages = () => {
    if (loadingLanguages) return <div>Loading Languages...</div>;
    if (errorLanguages) return <div>Error: {errorLanguages.message}</div>;
    if (dataLanguages) {
      const languages = dataLanguages.getEmployeeLanguage;
      return (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Employee Languages</h3>
          {languages.length > 0 ? (
            languages.map((language: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="text-lg font-semibold">{language.languageName}</h4>
                <p><strong>Proficiency:</strong> {language.proficiency}</p>
              </div>
            ))
          ) : (
            <p>No languages available.</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
    <div className='flex justify-center text-3xl text-red-800'>Check the details of Employee - {params.id}</div>
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <button
          onClick={() => toggleSection('personalInfo')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.personalInfo ? 'Hide' : 'Show'} Personal Information
        </button>
        {showDetails.personalInfo && renderPersonalInfo()}

        <button
          onClick={() => toggleSection('address')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.address ? 'Hide' : 'Show'} Address
        </button>
        {showDetails.address && renderAddress()}

        <button
          onClick={() => toggleSection('qualification')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.qualification ? 'Hide' : 'Show'} Qualification
        </button>
        {showDetails.qualification && renderQualification()}

        <button
          onClick={() => toggleSection('family')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.family ? 'Hide' : 'Show'} Family
        </button>
        {showDetails.family && renderFamily()}

        <button
          onClick={() => toggleSection('employmentHistory')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.employmentHistory ? 'Hide' : 'Show'} Employment History
        </button>
        {showDetails.employmentHistory && renderEmploymentHistory()}

        <button
          onClick={() => toggleSection('skills')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.skills ? 'Hide' : 'Show'} Skills
        </button>
        {showDetails.skills && renderSkills()}

        <button
          onClick={() => toggleSection('languages')}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          {showDetails.languages ? 'Hide' : 'Show'} Languages
        </button>
        {showDetails.languages && renderLanguages()}
      </div>
    
    </div>
    <div className='flex justify-center mt-8'>
    <Link href={`/EmployeeDocumentDetails?id=${params.id}`} as={`/EmployeeDocumentDetails/${params.id}`}>
<button className='bg-red-800 hover:bg-red-400 p-2 rounded-md text-white '>Go to Document Section</button></Link>
</div>
    </>
  );
};

export default Page;
