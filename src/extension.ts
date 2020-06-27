import * as vsc from 'vscode';

export function activate(context: vsc.ExtensionContext) {
    const documentSelector = [
        { language: 'typescript' },
        { language: 'javascript' },
        { language: 'csharp' },
    ];

    const replacements = <any>{
        "// Temp": "Temp: This comment is a LIE",
        "// TODO": "TODO: I'm never gonna do this",
        "// WIP": "WIP: it probably will take me 5 years to finish this"
    };

    const triggerCharacters = Object
        .keys(replacements)
        .map(x => x[x.length - 1]);

    let disposable = vsc.languages.registerCompletionItemProvider(documentSelector, {
        provideCompletionItems: (document: vsc.TextDocument, position: vsc.Position, token: vsc.CancellationToken, context: vsc.CompletionContext): vsc.ProviderResult<vsc.CompletionItem[] | vsc.CompletionList<vsc.CompletionItem>> => {
            for (let textToReplace in replacements) {
                var range = new vsc.Range(position.translate(undefined, -textToReplace.length), position);

                var textBeforeTheCursor = document.getText(range);

                if (textBeforeTheCursor == textToReplace) {
                    var completionItem = new vsc.CompletionItem(replacements[textToReplace], vsc.CompletionItemKind.Text);
                    completionItem.preselect = true;

                    return [completionItem];
                }
            }

            return [];
        }
    }, ...triggerCharacters);

    context.subscriptions.push(disposable);
}

export function deactivate() { }
