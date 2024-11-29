import pymongo
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import re
import sys
import json

load_dotenv()

MONGODB_URI = os.getenv("Mongo_URL")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
products_collection = db["products"]

model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_query_embedding(query):
    return model.encode(query).tolist()

def extract_price_constraints(query):
    match = re.search(r'(under|below|above|over)\s*(\d+)', query)
    if match:
        direction = match.group(1)
        amount = int(match.group(2))
        return direction, amount
    return None, None

def search_products(user_query, top_k=3):
    direction, amount = extract_price_constraints(user_query)
    textual_query = re.sub(r'(under|below|above|over)\s*\d+', '', user_query).strip()

    query_embedding = generate_query_embedding(textual_query)

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

    results = list(products_collection.aggregate(pipeline))

    if direction and amount:
        if direction in ["under", "below"]:
            results = [res for res in results if float(res.get("price", float('inf'))) < amount]
        elif direction in ["above", "over"]:
            results = [res for res in results if float(res.get("price", 0)) > amount]

    return results

if __name__ == "__main__":
    user_query = sys.stdin.read().strip()

    results = search_products(user_query, top_k=3)
    print(json.dumps(results))  
