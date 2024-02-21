import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../styles/formsubmissionpage.css";
const FormSubmissionPage = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formResponses, setFormResponses] = useState({});

  useEffect(() => {
    // Fetch form data from the backend using formId
    fetch(`http://localhost:8000/api/forms/${formId}`)
      .then((response) => response.json())
      .then((data) => setFormData(data))
      .catch((error) => console.error("Error fetching form data:", error));
  }, [formId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/forms/${formId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formResponses),
        }
      );
      if (response.ok) {
        console.log("Form response submitted successfully");
        // Optionally, you can redirect the user to a thank you page
      } else {
        console.error("Error submitting form response:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form response:", error);
    }
  };

  const handleInputChange = (event, fieldIndex) => {
    const { value } = event.target;
    setFormResponses({ ...formResponses, [fieldIndex]: value });
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{formData.title}</h1>
      <form onSubmit={handleSubmit}>
        {formData.fields.map((field, index) => (
          <div key={index}>
            <label htmlFor={`field-${index}`}>{field.label}</label>
            {field.type === "text" && (
              <input
                type="text"
                id={`field-${index}`}
                onChange={(event) => handleInputChange(event, index)}
                required={field.required}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                id={`field-${index}`}
                onChange={(event) => handleInputChange(event, index)}
                required={field.required}
              />
            )}
            {field.type === "checkbox" && (
              <input
                type="checkbox"
                id={`field-${index}`}
                onChange={(event) => handleInputChange(event, index)}
                required={field.required}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                id={`field-${index}`}
                onChange={(event) => handleInputChange(event, index)}
                required={field.required}
              />
            )}
            {field.type === "email" && (
              <input
                type="email"
                id={`field-${index}`}
                onChange={(event) => handleInputChange(event, index)}
                required={field.required}
              />
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormSubmissionPage;
