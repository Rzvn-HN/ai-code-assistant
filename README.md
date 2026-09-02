#  AI Code Assistant

A Retrieval-Augmented Generation (RAG) based AI coding assistant that understands software repositories and helps developers search and interact with their codebase using Large Language Models (LLMs).


##  Features

-  Repository code indexing
-  Semantic code search
-  Code chunking pipeline
-  Embedding-based retrieval
-  ChromaDB vector storage
-  FastAPI backend
-  Local LLM support with Ollama
-  VS Code Extension integration (in progress)



##  Architecture

```
Developer Question
        |
        ↓
   FastAPI Backend
        |
        ↓
    RAG Pipeline
        |
        ↓
 Vector Database (ChromaDB)
        |
        ↓
 Relevant Code Context
        |
        ↓
    LLM (Ollama)
        |
        ↓
    AI Response
```

---

##  How It Works

### Repository Indexing
The system scans a code repository and extracts source files.

Supported:

- Python
- JavaScript
- TypeScript

Ignored:

```
node_modules
venv
.git
build
dist
```



### Chunking & Retrieval

Large source files are divided into smaller chunks and converted into embeddings.

The system uses semantic search to retrieve relevant code based on meaning instead of simple keywords.

Example:

```
Question:
Where is API key configured?

↓

Retrieved:
Configuration related code
```



##  Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn

### AI / RAG
- LangChain
- ChromaDB
- Embedding Models
- Ollama

### Development
- Git
- GitHub
- VS Code Extension API



##  Project Structure

```
ai-code-assistant/

├── backend/
│   ├── main.py
│   └── rag/
│       ├── loader.py
│       ├── chunker.py
│       ├── vector_store.py
│       └── retriever.py
│
├── src/
│   ├── ai-service.ts
│   └── extension.ts
│
└── README.md
```



##  Run Project

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
cd backend

python -m uvicorn main:app --reload
```

Server:

```
http://127.0.0.1:8000
```



##  Current Status

Completed:

  Repository loader  
  Code chunking  
  Embedding generation  
  Vector database storage  
  Semantic search API  


In Progress:

 Ollama LLM integration  
 VS Code AI chat interface  
 Code explanation and suggestions  



##  Future Roadmap

- Full VS Code AI assistant
- Multi-language support
- Bug detection
- Code refactoring suggestions
- Private local AI coding companion



##  Author

AI Engineering Portfolio Project
