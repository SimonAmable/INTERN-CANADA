'use client';

import { useState } from 'react';

const SmallContact = (bg_col) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      setSubmitted(true);
      setMessage('');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to send message');
    }
  };

  return (
    <div className=' px-4 py-2 flex flex-row  '>
      
      {submitted ? (
        <p>Thank you for your message!!!</p>
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-row gap-2 items-center w-full '>
            <h1 className=' font-semibold text-lg'>Quick Feedback:</h1>
          <input 
            type="text" 
            name="message"
            value={message}
            onChange={handleChange}
            placeholder="Message"
            className='border-gray-400 border-2 rounded-3xl p-2 w-8/12 lg:w-5/12 h-fit'
            required
          />
          <button
            type="submit"
            className='border-2 border-black rounded-3xl px-4 py-2 transform transition-transform duration-300 hover:scale-110 '
          >
            Send
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default SmallContact;
