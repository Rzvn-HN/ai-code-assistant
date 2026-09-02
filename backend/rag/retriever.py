import chromadb
from sentence_transformers import SentenceTransformer


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


client = chromadb.PersistentClient(
    path="./chroma_db"
)


collection = client.get_collection(
    name="code_chunks"
)


def search_code(query, top_k=3):

    query_embedding = model.encode(
        [query]
    ).tolist()


    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )


    return results