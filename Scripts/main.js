exports.activate = function() {
    let alerter = new InvisibleAlert();

    nova.workspace.onDidAddTextEditor((editor) => {
        editor.onDidChange(() => {
            alerter.report();
        });
    });
}

exports.deactivate = function() {
}

class InvisibleAlert {
    constructor() {
        this.issueCollection = new IssueCollection();
    }

    report() {
        let workspace = nova.workspace;
        let editor = workspace.activeTextEditor;

        let docrange = new Range(0, editor.document.length);
        let doctext = editor.getTextInRange(docrange);

        let line = 1;
        let col = 1;
        let issues = [];
        for (const c of doctext) {
            if (c == String.fromCharCode(160)) {
                let issue = new Issue();
                issue.message = `NBSP detected`;
                issue.severity = IssueSeverity.Warning;
                issue.line = line;
                issue.column = col;

                issues.push(issue);
            }
            col++;
            if (/\r|\n/.exec(c)) {
                line++;
                col = 1;
            }
        }

        this.issueCollection.set(editor.document.uri, issues);
    }

}
