'use client';

import { useState } from 'react';

import SmallContact from '../ui/SmallContact';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to send message');
    }
  };

  return (
    <div className='h-[500px] p-10 flex flex-col items-center gap-3'>
      <h1 className='py-5 font-bold text-3xl'>Contact</h1>
      {submitted ? (
        <div className='min-w-60'>
          <p className='text-center'>Thank you for your message!!!</p>
          <div style={{ width: '100%', height: 0, paddingBottom: '83%', position: 'relative' }}>
            <iframe
              src="https://giphy.com/embed/i21tixUQEE7TEqwmYa"
              width="100%"
              height="100%"
              style={{ position: 'absolute' }}
              className="giphy-embed"
              allowFullScreen
            ></iframe>
          </div>
          <p><a href="https://giphy.com/gifs/theoffice-nbc-the-office-tv-i21tixUQEE7TEqwmYa">via GIPHY</a></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 items-center w-full justify-center'>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Name" 
            required
            className='border-gray-400 border-2 rounded-3xl p-2 w-10/12 lg:w-5/12'
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className='border-gray-400 border-2 rounded-3xl p-2 w-10/12 lg:w-5/12'
            required 
          />
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Message" 
            className='border-gray-400 border-2 rounded-3xl p-2 w-10/12 lg:w-5/12'
            required 
          />
          <button type="submit" className='border-2 border-black rounded-3xl px-3 py-1 transform transition-transform duration-300 hover:scale-110'>Send</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ContactPage;


// 'use client'; // Needed for client-side components in Next.js 13+ (if you're using the `app` directory)

// import { useState } from 'react';

// export default function Home () {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });

//   const [status, setStatus] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setStatus('Sending...');

//     try {
//       const res = await fetch('/api/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setStatus('Message sent successfully!');
//         setFormData({ name: '', email: '', message: '' }); // Reset form fields
//       } else {
//         setStatus('Error sending message.');
//       }
//     } catch (error) {
//       setStatus('An error occurred.');
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="message">Message:</label>
//           <textarea
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>
//         <button type="submit">Send Message</button>
//       </form>
//       {status && <p>{status}</p>}
//     </div>
//   );
// };

