import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/formpreviewpage.css";
const FormPreviewPage = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(
          `https://gray-rich-dragonfly.cyclic.app/api/forms/${formId}/preview`
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [formId]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-preview-container">
      <h2>Form Preview</h2>
      {formData.fields.map((field, index) => (
        <div key={index}>
          <label>{field.label}</label>
          {field.type === "text" && <input type="text" />}
          {field.type === "textarea" && <textarea />}
          {field.type === "checkbox" && <input type="checkbox" />}
        </div>
      ))}
    </div>
  );
};

export default FormPreviewPage;
