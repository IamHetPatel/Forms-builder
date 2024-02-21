import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from "./NavigationBar";

const FormResponsesPage = ({user, handleLogout}) => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Function to fetch responses for the specific form using formId
    const fetchFormResponses = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/forms/${formId}/responses`);
        const responseData = await response.json();
        setResponses(responseData.responses);
      } catch (error) {
        console.error('Error fetching form responses:', error);
      }
    };
    fetchFormResponses();
  }, [formId]);

  return (
    <div>
        <NavigationBar handleLogout={handleLogout} />
    <div className="form-responses-container">
      <h2>Form Responses</h2>
      {responses.map((response, index) => (
        <div key={index}>
          {/* Render each response */}
          <p>Response {index + 1}</p>
          {Object.entries(response).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      ))}
    </div>
    </div>
  );
};

export default FormResponsesPage;