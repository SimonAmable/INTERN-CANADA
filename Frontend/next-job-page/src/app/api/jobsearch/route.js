import clientPromise from '../../lib/mongodb'; // Import a promise-based MongoDB client connection

// Define an async function to handle GET requests
export async function GET(request) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  
  // Get the keyword for the search, defaulting to an empty string if not provided
  const keyword = searchParams.get('keyword') || "";
  
  // Get the location for the search, defaulting to an empty string if not provided
  const location = searchParams.get('location') || "";

  // Get the filters for the search, defaulting to an empty string if not provided
  const filter = searchParams.get('filter') || "";
  const jobType = searchParams.get('jobType') || "";
  const jobCategory = searchParams.get('jobCategory') || "";
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
    const collection = db.collection('all_jobs'); // Replace with your collection name

    // Query the collection to find documents matching the search keyword
    // Apply pagination by skipping documents and limiting the results
    
    // Construct the query object, make sure we get all documents if keyword is empty
  //   const query = keyword 
  // ? { $text: { $search: keyword }, apply_link: { $exists: true, $ne: "" } } 
  // : { apply_link: { $exists: true, $ne: "" } };

  const query = {
    apply_link: { $exists: true, $ne: "" }
  };
  
  // Start with an array to hold all conditions
  const conditions = [];
  
  // Add text search condition if keyword is provided
  // if (keyword) {
  //   conditions.push({ $text: { $search: keyword } });
  // }
  if (keyword) {
    const words = keyword.split(' ').filter(word => word); // Split keyword into individual words
    const regexConditions = words.map(word => ({
      $or: [
        { description: { $regex: new RegExp(word, 'i') } }, // Case-insensitive regex for description
        { title: { $regex: new RegExp(word, 'i') } },       // Case-insensitive regex for title
        { company: { $regex: new RegExp(word, 'i') } }      // Case-insensitive regex for company
      ]
    }));
  
    // Combine conditions using $or to match any of the words across the specified fields
    conditions.push({ $and: regexConditions });
  }
  
  // Add regex search condition for location if provided
  if (location) {
    conditions.push({ location: { $regex: new RegExp(location, 'i') } });
  }
  
  // Add regex search condition for job type if provided
  if (jobType) {
    conditions.push({ description: { $regex: new RegExp(jobType, 'i') } });
  }
  if (jobCategory) {
    conditions.push({ description: { $regex: new RegExp(jobCategory, 'i') } });
  }
  
  // If there are any conditions, add them to the query
  if (conditions.length > 0) {
    query.$and = conditions;
  }
    // if i manage to make filters in 1 hour carleton cs should just hire me already cmon man
    // Add filter for category keywords across multiple fields (e.g., title, description, category) using $and
    // PLAN : If inside the If, we can add more box choice fields for filtering on the front end and pass them as filter ez here
    // BAD FILTER, DONT PUSH TO PROD YET
    // if someone is readying this I can write better code, I'm a STARRRR, I promise!!! I just dont want to rn XDDD,
    

    // Perform a text search using the query object and pagination options
      const results = await collection
        .find(query) // Perform a text search using the keyword
        .skip(skip) // Skip the documents based on the current page
        .limit(limit) // Limit the number of documents returned
        .toArray(); // Convert the cursor to an array
  
      
    

    // Get the total count of documents that match the search criteria
    const totalResults = await collection.countDocuments(query);
    
    // Calculate the total number of pages based on the total results and limit
    const totalPages = Math.ceil(totalResults / limit);
    
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
