import clientPromise from '../../lib/mongodb'; // Import a promise-based MongoDB client connection

// Define an async function to handle GET requests
export async function GET(request) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  
  // Get the keyword for the search, defaulting to an empty string if not provided
  // const keyword = searchParams.get('keyword') || "";
  
  // Get the page number from the query parameters, defaulting to 1 if not provided
  const page = parseInt(searchParams.get('page')) || 1;
  
  // Get the number of results per page, defaulting to 10 if not provided
  const limit = parseInt(searchParams.get('limit')) || 10;
  
  // Calculate the number of documents to skip based on the page number and limit
  const skip = (page - 1) * limit;

  try {
    // Wait for the MongoDB client to be connected
    const client = await clientPromise;
    
    // Get the specific database and collection
    const db = client.db('canadian_intership_database'); // Replace with your database name
    const collection = db.collection('opportunities_glassdoor'); // Replace with your collection name

    // Query the collection to find documents matching the search keyword
    // Apply pagination by skipping documents and limiting the results
    const results = await collection
      .find({}) // Perform a text search using the keyword
      .skip(skip) // Skip the documents based on the current page
      .limit(limit) // Limit the number of documents returned
      .toArray(); // Convert the cursor to an array

    

    // Get the total count of documents that match the search criteria
    const totalResults = await collection.countDocuments({})
    
    // Calculate the total number of pages based on the total results and limit
    const totalPages = Math.ceil(totalResults / limit);
    
    console.log(totalResults)
    // Return the results along with pagination information
    return new Response(JSON.stringify({
      results, // The list of job opportunities
      page, // The current page number
      totalPages, // Total number of pages
      totalResults, // Total number of results
    }), { status: 200 });

  } catch (error) {
    // Log any errors that occur and return an error response
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching jobs' }), { status: 500 });
  }
}
