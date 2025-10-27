import * as vscode from 'vscode';
import { AIService } from './ai-service';

export function activate(context: vscode.ExtensionContext) {
    const aiService = new AIService();

    function showResultsPanel(title: string, content: string): void {
        const panel = vscode.window.createWebviewPanel(
            'aiResults',
            title,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [context.extensionUri]
            }
        );

        panel.webview.html = getWebviewContent(title, content);
    }

    function getWebviewContent(title: string, content: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        padding: 20px;
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                    }
                    .header {
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .content {
                        background: var(--vscode-editor-background);
                        padding: 20px;
                        border-radius: 5px;
                        border: 1px solid var(--vscode-panel-border);
                        white-space: pre-wrap;
                        line-height: 1.5;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>${title}</h2>
                </div>
                <div class="content">${content}</div>
            </body>
            </html>`;
    }

    function insertGeneratedCode(code: string): void {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(editBuilder => {
                if (editor.selection.isEmpty) {
                    editBuilder.insert(editor.selection.active, code);
                } else {
                    editBuilder.replace(editor.selection, code);
                }
            }).then(success => {
                if (success) {
                    vscode.window.showInformationMessage('Code inserted successfully!');
                }
            });
        }
    }

    // Command: Explain Code
    const explainCommand = vscode.commands.registerCommand('ai-code-assistant.explainCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Please open a file first');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code to explain');
            return;
        }

        try {
            vscode.window.showInformationMessage('Analyzing code...');
            const explanation = await aiService.explainCode(selectedText);
            showResultsPanel('Code Explanation', explanation);
        } catch (error: any) {
            vscode.window.showErrorMessage(error.message);
        }
    });

    // Command: Detect Bugs
    const detectBugsCommand = vscode.commands.registerCommand('ai-code-assistant.detectBugs', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Please open a file first');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code to analyze for bugs');
            return;
        }

        try {
            vscode.window.showInformationMessage('Scanning for bugs...');
            const bugReport = await aiService.detectBugs(selectedText);
            showResultsPanel('Bug Detection Results', bugReport);
        } catch (error: any) {
            vscode.window.showErrorMessage(error.message);
        }
    });

    // Command: Generate Code
    const generateCodeCommand = vscode.commands.registerCommand('ai-code-assistant.generateCode', async () => {
        const description = await vscode.window.showInputBox({
            prompt: 'Describe the code you want to generate',
            placeHolder: 'e.g., Create a function that sorts an array using quicksort algorithm',
            validateInput: (value: string) => {
                if (!value || value.trim().length < 10) {
                    return 'Please provide a more detailed description (at least 10 characters)';
                }
                return null;
            }
        });

        if (description) {
            try {
                vscode.window.showInformationMessage('Generating code...');
                const generatedCode = await aiService.generateCode(description);

                const action = await vscode.window.showQuickPick(
                    ['Insert into editor', 'View in panel'],
                    { placeHolder: 'How would you like to use the generated code?' }
                );

                if (action === 'Insert into editor') {
                    insertGeneratedCode(generatedCode);
                } else if (action === 'View in panel') {
                    showResultsPanel('Generated Code', generatedCode);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(error.message);
            }
        }
    });

    context.subscriptions.push(explainCommand, detectBugsCommand, generateCodeCommand);
}

export function deactivate() { }