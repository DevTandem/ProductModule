from sentence_transformers import SentenceTransformer
import sys
import json

model = SentenceTransformer('all-MiniLM-L6-v2')

def main():
    product_text = sys.stdin.read().strip()

    embedding = model.encode(product_text).tolist()

    print(json.dumps(embedding))

if __name__ == "__main__":
    main()