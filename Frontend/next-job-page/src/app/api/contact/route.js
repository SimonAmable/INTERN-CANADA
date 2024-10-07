import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const { name = 'Anonymous', email = 'no-email-provided@example.com', message } = await request.json();

    if ( !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const msg = {
      to: process.env.RECEIVER_EMAIL,  // Your receiving email
      from: process.env.SENDGRID_SENDER_EMAIL,  // Verified sender email
      subject: `Intern Canada - New Contact Form Submission from ${name}`,
      text: `You have a new message from ${name} (${email}): \n\n${message}`,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}



// import clientPromise from '../../lib/mongodb'; // Import a promise-based MongoDB client connection

// // Define an async function to handle GET requests
// export async function POST(request) {
//     // const {name, email, message } = req.body;

//     // Here, you would handle the form data, e.g., sending an email using a service like SendGrid, Mailgun, etc.
//     // For demonstration purposes, we'll just log the data.

//     // console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

//     // Simulate an email sending service response
//     res.status(200).json({ success: true, message: 'Message sent successfully!' });
// }
