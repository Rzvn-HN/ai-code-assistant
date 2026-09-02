import chromadb
from sentence_transformers import SentenceTransformer


# embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# create database
client = chromadb.PersistentClient(
    path="./chroma_db"
)


collection = client.get_or_create_collection(
    name="code_chunks"
)


def create_vector_store(chunks):

    texts = []

    ids = []

    for i, chunk in enumerate(chunks):

        texts.append(
            chunk["content"]
        )

        ids.append(
            str(i)
        )


    embeddings = model.encode(
        texts
    ).tolist()


    collection.add(
        documents=texts,
        embeddings=embeddings,
        ids=ids
    )


    return len(texts)