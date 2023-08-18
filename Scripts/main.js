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

const invisibleCharsList = [
    {
        code: 160,
        name: "No-Break Space",
        severity: IssueSeverity.Warning
    },
    {
        code: 173,
        name: "Soft Hyphen",
        severity: IssueSeverity.Warning
    },
    {
        code: 847,
        name: "Combining Grapheme Joiner",
        severity: IssueSeverity.Warning
    },
    {
        code: 1574,
        name: "Arabic Letter Mark",
        severity: IssueSeverity.Hint
    },
    {
        code: 8203,
        name: "Zero Width Space",
        severity: IssueSeverity.Error
    },
    {
        code: 8204,
        name: "Zero Width Space Non-Joiner",
        severity: IssueSeverity.Error
    },
    {
        code: 8205,
        name: "Zero Width Space Joiner",
        severity: IssueSeverity.Error
    },
    {
        code: 8206,
        name: "Left-To-Right Mark",
        severity: IssueSeverity.Hint
    },
    {
        code: 8207,
        name: "Right-To-Left Mark",
        severity: IssueSeverity.Hint
    },
    {
        code: 8239,
        name: "Narrow No-Break Space",
        severity: IssueSeverity.Warning
    },
    {
        code: 8287,
        name: "Medium Mathematical Space",
        severity: IssueSeverity.Warning
    },
    {
        code: 8288,
        name: "Word Joiner",
        severity: IssueSeverity.Warning
    },
    {
        code: 8289,
        name: "Function Application",
        severity: IssueSeverity.Warning
    },
    {
        code: 8290,
        name: "Invisible Times",
        severity: IssueSeverity.Warning
    },
    {
        code: 8291,
        name: "Invisible Separator",
        severity: IssueSeverity.Warning
    },
    {
        code: 8292,
        name: "Invisible Plus",
        severity: IssueSeverity.Warning
    },
    {
        code: 8204,
        name: "Invisible Times",
        severity: IssueSeverity.Warning
    },
    {
        code: 65279,
        name: "Zero Width No-Break Space",
        severity: IssueSeverity.Error
    }
];

const invisibleCharCodes = new Set(invisibleCharsList.map((o) => o.code));

const invisibleChars = {};
for (char of invisibleCharsList) {
    invisibleChars[char.code] = char;
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

        let cCode, o, issue;
        for (const c of doctext) {
            cCode = c.charCodeAt();
            if (invisibleCharCodes.has(cCode)) {
                o = invisibleChars[cCode];
                issue = new Issue();
                issue.message = `${o.name} detected`;
                issue.severity = o.severity || IssueSeverity.Warning;
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
