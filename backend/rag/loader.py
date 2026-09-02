import os

IGNORED_DIRS = {
    "node_modules",
    "venv",
    ".git",
    "__pycache__",
    ".vscode",
    "dist",
    "build"
}

SUPPORTED_EXTENSIONS = (
    ".py",
    ".ts",
    ".js",
)


def load_repository(path):

    documents = []

    for root, dirs, files in os.walk(path):
        dirs[:] = [
            d for d in dirs
            if d not in IGNORED_DIRS
        ]

        for file in files:

            if file.endswith(SUPPORTED_EXTENSIONS):

                file_path = os.path.join(root, file)

                try:
                    with open(
                        file_path,
                        "r",
                        encoding="utf-8"
                    ) as f:
                        content = f.read()

                    if "node_modules" in file_path:
                        continue
                    documents.append(
                        {
                            "file": file_path,
                            "content": content
                        }
                    )

                except Exception as e:
                    print(
                        f"Cannot read {file_path}: {e}"
                    )

    return documents