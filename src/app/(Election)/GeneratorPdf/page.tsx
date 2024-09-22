// pages/generator.tsx
"use client";
import { ProgressBar } from "@/app/components/ProgressBar";
import { useState, useEffect } from "react";

const GeneratorComponent = () => {
  const [departments, setDepartments] = useState([]);
  const [progress, setProgress] = useState(0);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(`${API}/Election/Data`);
    const data = await res.json();

    // Group data by department
    const grouped = data.reduce((acc: any, curr: any) => {
      if (!acc[curr.Department]) acc[curr.Department] = { name: curr.Department, members: [] }; // Add 'name' field
      acc[curr.Department].members.push(curr);
      return acc;
    }, {});

    setDepartments(Object.values(grouped));
  };

  fetchData();
}, [API]);
  
  
  const handleGeneratePDF = async () => {
    setProgress(0);
  
    // Check if the departments data is correct
    console.log('Departments before sending:', departments);
  
    if (departments.length === 0) {
      alert('No data available for generating PDFs');
      return;
    }
  
    const totalDepartments = departments.length;
    let currentProgress = 0;
  
    for (const department of departments) {
      const response = await fetch(`${API}/Election/GeneratePdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departments: [department] }),
      });
  
      if (response.ok) {
        currentProgress += 1;
        setProgress(Math.floor((currentProgress / totalDepartments) * 100));
      } else {
        console.error('Failed to generate PDF for department:', department);
      }
    }
  };
  
  

  return (
    <div>
      {/* <div>
    {departments.map((department, index) => (
      <div key={index}>
        <h3>{department.name}</h3>
        <ul>
          {department.members.map((member, memberIndex) => (
            <li key={memberIndex}>{member.FullName}</li>
          ))}
        </ul>
      </div>
    ))}
  </div> */}
      <button onClick={handleGeneratePDF}>Generate PDF</button>
      <ProgressBar progress={progress} />
    </div>
  );
};

export default GeneratorComponent;
