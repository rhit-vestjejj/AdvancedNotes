// frontend/src/components/Login.js
import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, date})
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username" 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type = "text"
        placeholder= "date"
        value= {date}
        onChange = {(e) => setDate(e.target.value)}
        />
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
