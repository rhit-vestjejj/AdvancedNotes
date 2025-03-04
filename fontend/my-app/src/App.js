import React, { useState, useEffect, useRef, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import { DateTime } from 'luxon';


function App() {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date());
  const [prevDate, setPrevDate] = useState(new Date());
  const textAreaRef = useRef(null);
  const [allNotes, setAllNotes] = useState([]);

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
      const response = await fetch(`https://advanced-notes.vercel.app/api/send_notes?date=${getFormattedDate(date)}&prevDate=${getFormattedDate(prevDate)}`, {
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
        const response = await fetch('https://advanced-notes.vercel.app/api/get_notes', {
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
      const response = await fetch(`https://advanced-notes.vercel.app/api/get_notes?date=${getFormattedDate(date)}&prevDate=${getFormattedDate(prevDate)}`, {
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

  const loadDataDateSide = useCallback(async () => {
    try {
      const response = await fetch(`https://advanced-notes.vercel.app/api/get_notes?date=${getFormattedDate(date)}&prevDate=${getFormattedDate(prevDate)}`, {
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

  const loadAllDays = useCallback(async () => {
    try {
      const response = await fetch(`https://advanced-notes.vercel.app/api/get_all_notes`, {
        method: 'GET',
      });
      const result = await response.json();
      if(response.ok) {
        setAllNotes(result.content);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error during get_all_notes:', error)
    }
  }, [])

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

  function changeDateSide(newDate) {
    const newDates  = DateTime.fromISO(newDate).toJSDate();
    setPrevDate(date)
    setDate(newDates)
    console.log(date)
    console.log(prevDate)
    loadDataDateSide()
  }

  useEffect(() => {
    loadDataDate();
  }, [loadDataDate]);

  return (
    <div style = {{
      textAlign: "center",
      justifyContent: "center",
    }}>
      <SideBar allNotes={allNotes} changeDateSide={changeDateSide} loadAllDays={loadAllDays} />
      <h1 className = "title">{getFormattedDate(date)}</h1>
      <form>
        <textarea
          value = {text}
          ref = {textAreaRef}
          onChange={(e) => setText(e.target.value)}
          placeholder = {text ? text : "Put your text here..."}
          onBlur = { handleSubmit }
          className = "noteBox"
        />
      </form>
      <DatePicker selected={date} onChange={(newDate) => changeDate(newDate)} className = "dateTimePicker" dateFormat="yyyy-MM-dd" />
        <TalkGpt />
    </div>
  );
}

function TalkGpt() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const [messageIsOpen, setMessageIsOpen] = useState(false);
  const textAreaRef = useRef(null);
  const responseAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      const newHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${newHeight}px`;
      setInputHeight(newHeight + 1.6);
    }
  }, [message]);

  useEffect(() => {
    const textarea = responseAreaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [response]);

  const submitChat = async (e) => {
    setResponse("Loading... (45-60 seconds)");
    setMessage("");
    e.preventDefault();
    try {
      const response = await fetch(`https://advanced-notes.vercel.app/api/send_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const result = await response.json();
      if (response.ok) {
        setResponse(result.content);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(`Error during send_chat ${error}`);
    }
  };

  return (
    <div>
      <div
        className={`messageBox ${messageIsOpen ? 'visible' : ''}`}
      >
        <button className="closeButton" onClick={() => setMessageIsOpen(false)}>
          X
        </button>
        <textarea
          className="sendMessageBox"
          value={message}
          ref={textAreaRef}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={message ? message : "Message the AI..."}
        />
        <button
          onClick={submitChat}
          className="sendMessage"
          style={{
            height: `${inputHeight + 2}px`,
          }}
        >
          Send
        </button>
        <textarea
          className="responseBox"
          value={response}
          ref={responseAreaRef}
          placeholder="Send a message below.."
        />
      </div>
      <button
        className="chatButton"
        onClick={() => setMessageIsOpen(true)}
        style={{
          transform: messageIsOpen ? 'scale(0)' : 'scale(1)',
        }}
      >
        +
      </button>
    </div>
  );
}

function SideBar({ allNotes, changeDateSide, loadAllDays }) {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

  return (
    <div>
      <div className={`sidebar ${sideBarIsOpen ? 'visible' : ''}`} onBlur= {() => setSideBarIsOpen(false) }>
        <button className="closeSideBar" onClick={() => setSideBarIsOpen(false)}>
          X
        </button>
        <div className = "sidebar-content">
          {allNotes.map((day, index) => (
            <button
              key={index}
              className = "sideBarDate"
              onClick={() => { 
                changeDateSide(day);
                setSideBarIsOpen(false);
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <button
        className="sidebarButton"
        onClick={() => {
          setSideBarIsOpen(true);
          loadAllDays();
        }}
        style={{
          visibility: sideBarIsOpen ? 'hidden' : 'visible',
        }}
      >
        ☰
      </button>
    </div>
  );
}

export default App;
