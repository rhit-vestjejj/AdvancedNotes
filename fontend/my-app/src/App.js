import React, { useState, useEffect, useRef, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date());
  const [prevDate, setPrevDate] = useState(new Date());
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height =
      textAreaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/send_notes?date=${getFormattedDate(date)}&prevDate=${getFormattedDate(prevDate)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const result = await response.json();
      if (response.ok) {
        // alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error during send_notes:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get_notes', {
          method: 'GET',
        });
        const result = await response.json();
        if (response.ok) {
          setText(result.content);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error during get_notes:', error);
      }
    };
    loadData();
  }, []); 

  const loadDataDate = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get_notes?date=${getFormattedDate(date)}&prevDate=${getFormattedDate(prevDate)}`, {
        method: 'GET',
      });
      const result = await response.json();
      if (response.ok) {
        setText(result.content);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error during get_notes:', error);
    }
  }, [date, prevDate]);

  const getFormattedDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  function changeDate(newDate) {
    setPrevDate(date)
    setDate(newDate)
    console.log(date)
    console.log(prevDate)
    loadDataDate()
  }

  useEffect(() => {
    loadDataDate();
  }, [loadDataDate]);

  return (
    <div style = {{
      textAlign: "center",
      justifyContent: "center",
    }}>
      <h1>{getFormattedDate(date)}</h1>
      <form>
        <textarea
          value = {text}
          ref = {textAreaRef}
          onChange={(e) => setText(e.target.value)}
          placeholder = {text ? text : "Put your text here..."}
          style = {{
            width: '100%',
            height: 'auto',
          }}
          onBlur = { handleSubmit }
        />
      </form>
      <DatePicker selected={date} onChange={(newDate) => changeDate(newDate) } dateFormat="yyyy-MM-dd" />
    </div>
  );
}

export default App;
