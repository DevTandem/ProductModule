import time
import pymongo
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("Mongo_URL")
DB_NAME = os.getenv("DB_NAME")

model = SentenceTransformer('all-MiniLM-L6-v2')
client = pymongo.MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db['products']

def generate_and_save_embeddings():
    products = collection.find({})
    for product in products:
        text_parts = [
            product.get('c_name', ''),
            product.get('s_name', ''),
            product.get('description', ''),
            str(product.get('price', '')),
            str(product.get('qty', '')),
            ' '.join([colour['colour_name'] for colour in product.get('colour', [])]),
            ' '.join([f"{k}: {v}" for k, v in product.get('characteristics', {}).items()])
        ]
        text = " ".join(text_parts)
        embedding = model.encode(text)
        collection.update_one(
            {"_id": product["_id"]},
            {"$set": {"embedding": embedding.tolist()}}
        )
    print("Embeddings updated. Waiting for the next run...")

if __name__ == "__main__":
    while True:
        generate_and_save_embeddings()
        time.sleep(60)  # Wait for 60 seconds before the next check
