from sentence_transformers import SentenceTransformer
import sys
import json

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

def main():
    # Read product text from stdin
    product_text = sys.stdin.read().strip()

    # Generate embedding
    embedding = model.encode(product_text).tolist()

    # Output the embedding as JSON
    print(json.dumps(embedding))

if __name__ == "__main__":
    main()