const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // फ्रंटेंड से API कॉल्स के लिए CORS इनेबल करें
app.use(express.json());

// नोट: यह उपयोगकर्ता डेटा मेमोरी में स्टोर करता है। प्रोडक्शन में डेटाबेस उपयोग करें
let users = [{ email: 'test@example.com', password: '1234' }]; // डेमो यूजर लिस्ट (पासवर्ड बिना हैश के)

function validateEmail(email) {
  // सिंपल ईमेल फॉर्मेट चेक (आवश्यकतानुसार सुधार करें)
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
  // सिंपल पासवर्ड चेक: न्यूनतम 4 कैरेक्टर (आप आवश्यकता अनुसार स्ट्रॉन्ग पैसवर्ड चेक डाल सकते हैं)
  return typeof password === 'string' && password.length >= 4;
}

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Invalid email or password format' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, message: 'User already exists!' });
  }

  // प्रोडक्शन में पासवर्ड हैशिंग ज़रूरी है (जैसे bcrypt)
  users.push({ email, password });

  res.json({ success: true, message: 'Signup successful' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Invalid email or password format' });
  }

  const user = users.find(u => u.email === email);

  if (user && user.password === password) {
    // लॉगिन सफल
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
