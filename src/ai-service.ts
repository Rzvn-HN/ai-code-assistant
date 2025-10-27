import * as vscode from 'vscode';

export class AIService {
    private getApiKey(): string {
        const config = vscode.workspace.getConfiguration('aiCodeAssistant');
        const apiKey = config.get<string>('apiKey', '');

        if (!apiKey) {
            throw new Error('Please set your OpenAI API key (to use)');
        }
        return apiKey;
    }

    private async makeAIRequest(prompt: string): Promise<string> {
        const apiKey = this.getApiKey();
        const config = vscode.workspace.getConfiguration('aiCodeAssistant');
        const model = config.get<string>('model', 'gpt-3.5-turbo');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your settings.');
                } else if (response.status === 429) {
                    throw new Error('API rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`API request failed with status: ${response.status}`);
                }
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error: any) {
            throw new Error('Failed to connect to AI service: ' + error.message);
        }
    }

    async explainCode(code: string): Promise<string> {
        const prompt = `
Please analyze and explain the following code in detail:

Code:
\`\`\`
${code}
\`\`\`

Please provide:
1. What this code does
2. Key functions and their purposes
3. Important variables and data structures
4. Overall algorithm or approach
5. Any notable patterns or techniques

Provide a clear, concise explanation that would help another developer understand this code quickly.
        `;
        return await this.makeAIRequest(prompt);
    }

    async detectBugs(code: string): Promise<string> {
        const prompt = `
Analyze the following code for potential bugs, issues, and improvements:

Code:
\`\`\`
${code}
\`\`\`

Please identify:
1. Potential bugs or runtime errors
2. Logical errors
3. Security vulnerabilities
4. Performance issues
5. Code style and best practice violations

For each issue found, provide:
- The specific problem
- Why it's problematic
- Suggested fix

Be thorough but focus on the most critical issues first.
        `;
        return await this.makeAIRequest(prompt);
    }

    async generateCode(description: string): Promise<string> {
        const prompt = `
Based on the following description, generate clean, efficient code:

Description: ${description}

Please provide:
1. Well-commented code that matches the description
2. Use appropriate programming language based on context
3. Include error handling where necessary
4. Follow best practices and coding standards
5. Make the code reusable and maintainable

Return only the code with minimal explanation.
        `;
        return await this.makeAIRequest(prompt);
    }

    async optimizeCode(code: string): Promise<string> {
        const prompt = `
Analyze the following code for optimization opportunities:

Code:
\`\`\`
${code}
\`\`\`

Please suggest:
1. Performance optimizations
2. Memory usage improvements
3. Algorithmic improvements
4. Code simplification
5. Best practice implementations

For each suggestion, explain:
- What to change
- Why it's better
- How to implement it

Focus on practical, impactful optimizations.
        `;
        return await this.makeAIRequest(prompt);
    }
}