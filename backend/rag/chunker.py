from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = []

    for doc in documents:

        splits = splitter.split_text(
            doc["content"]
        )

        for chunk in splits:

            chunks.append(
                {
                    "file": doc["file"],
                    "content": chunk
                }
            )

    return chunks