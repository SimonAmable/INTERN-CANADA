from pymongo import MongoClient
# from pymongo.errors import ConnectionError

# Define the connection URI for the local MongoDB server
mongo_uri = "mongodb://localhost:27017"

def test_mongodb_connection(uri):
    try:
        # Create a MongoClient instance
        client = MongoClient(uri)

        # Ping the server to check the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except ConnectionError as e:
        print(f"Failed to connect to MongoDB: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_mongodb_connection(mongo_uri)

