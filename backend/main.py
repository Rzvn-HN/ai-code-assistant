from fastapi import FastAPI

from rag.retriever import search_code
from rag.loader import load_repository
from rag.chunker import split_documents
from rag.vector_store import create_vector_store


app = FastAPI(
    title="AI Code Assistant RAG Backend"
)


@app.get("/search")
def search(q: str):

    results = search_code(q)

    return {
        "query": q,
        "results": results
    }


@app.get("/")
def home():

    docs = load_repository("../")

    chunks = split_documents(
        docs
    )

    stored = create_vector_store(
        chunks
    )

    return {
        "files_found": len(docs),
        "chunks_created": len(chunks),
        "vectors_saved": stored
    }