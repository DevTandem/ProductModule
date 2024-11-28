import pymongo
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import re
import sys
import json

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("Mongo_URL")
DB_NAME = os.getenv("DB_NAME")

# MongoDB connection
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
products_collection = db["products"]

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Helper function: Create embedding for a query
def generate_query_embedding(query):
    return model.encode(query).tolist()

def extract_price_constraints(query):
    match = re.search(r'(under|below|above|over)\s*(\d+)', query)
    if match:
        direction = match.group(1)
        amount = int(match.group(2))
        return direction, amount
    return None, None

def search_products(user_query, top_k=5):
    # Step 1: Extract price constraints
    direction, amount = extract_price_constraints(user_query)
    textual_query = re.sub(r'(under|below|above|over)\s*\d+', '', user_query).strip()

    # Step 2: Generate embedding for the textual query
    query_embedding = generate_query_embedding(textual_query)

    # Step 3: Perform vector search
    pipeline = [
        {
            "$search": {
                "index": "embedding",
                "knnBeta": {
                    "vector": query_embedding,
                    "path": "embedding",
                    "k": top_k
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "c_name": 1,
                "s_name": 1,
                "description": 1,
                "price": 1,
                "colour": 1,
                "characteristics": 1,
                "score": {"$meta": "searchScore"}
            }
        }
    ]

    # Execute vector search
    results = list(products_collection.aggregate(pipeline))

    # Step 4: Apply price filtering if necessary
    if direction and amount:
        if direction in ["under", "below"]:
            results = [res for res in results if float(res.get("price", float('inf'))) < amount]
        elif direction in ["above", "over"]:
            results = [res for res in results if float(res.get("price", 0)) > amount]

    return results

if __name__ == "__main__":
    # Read search keyword from stdin
    user_query = sys.stdin.read().strip()

    # Perform search and output results
    results = search_products(user_query, top_k=5)
    print(json.dumps(results))  # Output results as JSON
