import clientPromise from '../../lib/mongodb'; // Import a promise-based MongoDB client connection

// Define an async function to handle GET requests
export async function POST(request) {
    // const {name, email, message } = req.body;

    // Here, you would handle the form data, e.g., sending an email using a service like SendGrid, Mailgun, etc.
    // For demonstration purposes, we'll just log the data.

    // console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

    // Simulate an email sending service response
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
}
