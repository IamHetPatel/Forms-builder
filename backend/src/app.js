require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
require("./db/conn");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const auth = require("./middleware/auth")
const Register = require("./models/register");
const Form = require('./models/form'); 

// Register route
app.post("/api/register", async (req, res) => {
  try {
      const { username, email, password } = req.body;
      const userExists = await Register.findOne({ email });
      if (userExists) {
          return res.status(400).json({ error: "User already exists" });
      }
      const newUser = new Register({ username, email, password });
      const token = await newUser.generateAuthToken();
      // res.cookie("jwt", token, {
      //     expires: new Date(Date.now() + 86400000), // 24 hours
      //     httpOnly: true
      // });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await Register.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = await user.generateAuthToken();
      // res.cookie("jwt", token, {
      //     expires: new Date(Date.now() + 86400000), // 24 hours
      //     httpOnly: true
      // });
      res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout route
app.post("/api/logout", async (req, res) => {
  try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// View user profile
app.get('/api/user/profile', async (req, res) => {
    try {
      // Fetch the user profile based on the authenticated user
      const user = req.user;
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Update user profile
  app.put('/api/user/profile', async (req, res) => {
    try {
      // Fetch the user profile based on the authenticated user
      const user = req.user;
      // Update user profile information
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
  
      // Save the updated user profile
      await user.save();
  
      res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
  });  

// Form Creation API
app.post('/api/forms', async (req, res) => {
    try {
        const { title, fields, user_id } = req.body;
        const createdBy = user_id;
        const form = new Form({ title, fields, createdBy });
        await form.save();
        res.status(201).json({ message: 'Form created successfully', form });
    } catch (error) {
        // Handle errors
        console.error('Error creating form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve all forms created by the user
app.get('/api/forms/:_id', async (req, res) => {
    try {
      const userId = req.params._id; 
      const forms = await Form.find({ createdBy: userId });
  
      res.status(200).json(forms);
    } catch (error) {
      console.error('Error retrieving forms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update an existing form
app.put('/api/forms/:formId', async (req, res) => {
    try {
      const { title, fields } = req.body;
      const formId = req.params.formId;
      // const createdBy = req.user._id;
  
      // Check if the form exists and is created by the current user
      const existingForm = await Form.findOne({ _id: formId });
      if (!existingForm) {
        return res.status(404).json({ error: 'Form not found or you do not have permission to update it' });
      }
  
      // Update the form title and fields
      existingForm.title = title;
      existingForm.fields = fields;
  
      // Save the updated form
      await existingForm.save();
  
      res.status(200).json({ message: 'Form updated successfully', form: existingForm });
    } catch (error) {
      console.error('Error updating form:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// Delete an existing form
app.delete('/api/forms/:formId', async (req, res) => {
    try {
      const formId = req.params.formId;
      const createdBy = req.user._id;
  
      // Check if the form exists and is created by the current user
      const existingForm = await Form.findOne({ _id: formId, createdBy });
      if (!existingForm) {
        return res.status(404).json({ error: 'Form not found or you do not have permission to delete it' });
      }
  
      // Delete the form
      await existingForm.remove();
  
      res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      console.error('Error deleting form:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/forms/:formId/preview', async (req, res) => {
  try {
      const formId = req.params.formId;
      const form = await Form.findById(formId);
      if (!form) {
          return res.status(404).json({ error: 'Form not found' });
      }
      
      res.status(200).json(form);
      
  } catch (error) {
      console.error('Error retrieving form input details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Submit a response to a form
app.post('/api/forms/:formId/submit', async (req, res) => {
    try {
      const formId = req.params.formId;
      const formData = req.body;
  
      // Fetch the form by ID to ensure it exists
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
  
      // Push the response data to the 'responses' array in the form document
      form.responses.push(formData);
      await form.save();
  
      res.status(201).json({ message: 'Form response submitted successfully' });
    } catch (error) {
      console.error('Error submitting form response:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// Retrieve responses for a specific form
app.get('/api/forms/:formId/responses', async (req, res) => {
    try {
      const formId = req.params.formId;
  
      // Fetch the form by ID to ensure it exists
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
  
      // Return the responses for the form
      res.status(200).json({ responses: form.responses });
    } catch (error) {
      console.error('Error retrieving form responses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  


app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
