import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import "../styles/formbuilderpage.css";
const FormBuilderPage = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  // State variables to store form data
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);

  // Function to handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Function to handle adding a new field
  const addField = () => {
    setFields([...fields, { label: "", type: "text", required: false }]);
  };

  // Function to handle removing a field
  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  // Function to handle field property change
  const handleFieldChange = (index, property, value) => {
    const updatedFields = [...fields];
    updatedFields[index][property] = value;
    setFields(updatedFields);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(user._id);
      const user_id = user._id;

      // Send form data to the backend API
      const response = await fetch(
        "https://gray-rich-dragonfly.cyclic.app/api/forms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, fields, user_id }),
        }
      );
      if (response.ok) {
        // Redirect to a success page upon successful form creation
        navigate("/");
      } else {
        // Handle error response
        console.error("Form creation failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return (
    <div>
      <NavigationBar handleLogout={handleLogout} />
      <h2>Create Form</h2>
      <form className="form-creation-container" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <h3>Fields:</h3>
          <button type="button" onClick={addField}>
            Add Field
          </button>
          {fields.map((field, index) => (
            <div key={index}>
              <label htmlFor={`label-${index}`}>Label:</label>
              <input
                type="text"
                id={`label-${index}`}
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
                required
              />
              <label htmlFor={`type-${index}`}>Type:</label>
              <select
                id={`type-${index}`}
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                {/* Add more field types as needed */}
              </select>
              <label htmlFor={`required-${index}`}>Required:</label>
              <input
                type="checkbox"
                id={`required-${index}`}
                checked={field.required}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
              />
              <button type="button" onClick={() => removeField(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="submit">Create Form</button>
      </form>
    </div>
  );
};

export default FormBuilderPage;
