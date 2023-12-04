<script lang="ts">
    import { FileTerminal } from "lucide-svelte";
    import { Dialog, Button } from "$lib";
    export let open = false;
    import { _ } from "svelte-i18n";
    import { onDestroy, onMount } from "svelte";
    import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
    import { currentTheme } from "$lib/DarkMode";
    import type { Macro } from "$lib/interfaces";
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

    export let onClose = () => {
        open = false;
    };
    export let onSave = (name: string, code: string) => {};

    export let macro: Macro;

    $: theme = $currentTheme;
    let editor: Monaco.editor.IStandaloneCodeEditor;
    let monaco: typeof Monaco;
    let editorContainer: HTMLElement;
    let loaded = false;

    onMount(async () => {
        load();
    });

    async function load() {
        self.MonacoEnvironment = {
            getWorker: function (_moduleId: any, label: string) {
                if (label === 'json') {
                    return new jsonWorker();
                }
                if (label === 'css' || label === 'scss' || label === 'less') {
                    return new cssWorker();
                }
                if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    return new htmlWorker();
                }
                if (label === 'typescript' || label === 'javascript') {
                    return new tsWorker();
                }
                return new editorWorker();
            }
        };

        monaco = await import("monaco-editor");
        // monaco = Monaco;
        // monaco = await loader.init();
        

        monaco.editor.defineTheme("dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                {
                    background: "272822",
                    token: "",
                },
                {
                    foreground: "75715e",
                    token: "comment",
                },
                {
                    foreground: "e6db74",
                    token: "string",
                },
                {
                    foreground: "ae81ff",
                    token: "constant.numeric",
                },
                {
                    foreground: "ae81ff",
                    token: "constant.language",
                },
                {
                    foreground: "ae81ff",
                    token: "constant.character",
                },
                {
                    foreground: "ae81ff",
                    token: "constant.other",
                },
                {
                    foreground: "f92672",
                    token: "keyword",
                },
                {
                    foreground: "f92672",
                    token: "storage",
                },
                {
                    foreground: "66d9ef",
                    fontStyle: "italic",
                    token: "storage.type",
                },
                {
                    foreground: "a6e22e",
                    fontStyle: "underline",
                    token: "entity.name.class",
                },
                {
                    foreground: "a6e22e",
                    fontStyle: "italic underline",
                    token: "entity.other.inherited-class",
                },
                {
                    foreground: "a6e22e",
                    token: "entity.name.function",
                },
                {
                    foreground: "fd971f",
                    fontStyle: "italic",
                    token: "variable.parameter",
                },
                {
                    foreground: "f92672",
                    token: "entity.name.tag",
                },
                {
                    foreground: "a6e22e",
                    token: "entity.other.attribute-name",
                },
                {
                    foreground: "66d9ef",
                    token: "support.function",
                },
                {
                    foreground: "66d9ef",
                    token: "support.constant",
                },
                {
                    foreground: "66d9ef",
                    fontStyle: "italic",
                    token: "support.type",
                },
                {
                    foreground: "66d9ef",
                    fontStyle: "italic",
                    token: "support.class",
                },
                {
                    foreground: "f8f8f0",
                    background: "f92672",
                    token: "invalid",
                },
                {
                    foreground: "f8f8f0",
                    background: "ae81ff",
                    token: "invalid.deprecated",
                },
                {
                    foreground: "cfcfc2",
                    token: "meta.structure.dictionary.json string.quoted.double.json",
                },
                {
                    foreground: "75715e",
                    token: "meta.diff",
                },
                {
                    foreground: "75715e",
                    token: "meta.diff.header",
                },
                {
                    foreground: "f92672",
                    token: "markup.deleted",
                },
                {
                    foreground: "a6e22e",
                    token: "markup.inserted",
                },
                {
                    foreground: "e6db74",
                    token: "markup.changed",
                },
                {
                    foreground: "ae81ffa0",
                    token: "constant.numeric.line-number.find-in-files - match",
                },
                {
                    foreground: "e6db74",
                    token: "entity.name.filename.find-in-files",
                },
            ],
            colors: {
                "editor.foreground": "#F8F8F2",
                "editor.background": "#272822",
                "editor.selectionBackground": "#49483E",
                "editor.lineHighlightBackground": "#3E3D32",
                "editorCursor.foreground": "#F8F8F0",
                "editorWhitespace.foreground": "#3B3A32",
                "editorIndentGuide.activeBackground": "#9D550FB0",
                "editor.selectionHighlightBorder": "#222218",
            },
        });

        monaco.editor.defineTheme("light", {
            base: "vs",
            inherit: true,
            rules: [
                {
                    background: "F8F8FF",
                    token: "",
                },
                {
                    foreground: "999988",
                    fontStyle: "italic",
                    token: "comment",
                },
                {
                    foreground: "999999",
                    fontStyle: "bold",
                    token: "comment.block.preprocessor",
                },
                {
                    foreground: "999999",
                    fontStyle: "bold italic",
                    token: "comment.documentation",
                },
                {
                    foreground: "999999",
                    fontStyle: "bold italic",
                    token: "comment.block.documentation",
                },
                {
                    foreground: "a61717",
                    background: "e3d2d2",
                    token: "invalid.illegal",
                },
                {
                    fontStyle: "bold",
                    token: "keyword",
                },
                {
                    fontStyle: "bold",
                    token: "storage",
                },
                {
                    fontStyle: "bold",
                    token: "keyword.operator",
                },
                {
                    fontStyle: "bold",
                    token: "constant.language",
                },
                {
                    fontStyle: "bold",
                    token: "support.constant",
                },
                {
                    foreground: "445588",
                    fontStyle: "bold",
                    token: "storage.type",
                },
                {
                    foreground: "445588",
                    fontStyle: "bold",
                    token: "support.type",
                },
                {
                    foreground: "008080",
                    token: "entity.other.attribute-name",
                },
                {
                    foreground: "0086b3",
                    token: "variable.other",
                },
                {
                    foreground: "999999",
                    token: "variable.language",
                },
                {
                    foreground: "445588",
                    fontStyle: "bold",
                    token: "entity.name.type",
                },
                {
                    foreground: "445588",
                    fontStyle: "bold",
                    token: "entity.other.inherited-class",
                },
                {
                    foreground: "445588",
                    fontStyle: "bold",
                    token: "support.class",
                },
                {
                    foreground: "008080",
                    token: "variable.other.constant",
                },
                {
                    foreground: "800080",
                    token: "constant.character.entity",
                },
                {
                    foreground: "990000",
                    token: "entity.name.exception",
                },
                {
                    foreground: "990000",
                    token: "entity.name.function",
                },
                {
                    foreground: "990000",
                    token: "support.function",
                },
                {
                    foreground: "990000",
                    token: "keyword.other.name-of-parameter",
                },
                {
                    foreground: "555555",
                    token: "entity.name.section",
                },
                {
                    foreground: "000080",
                    token: "entity.name.tag",
                },
                {
                    foreground: "008080",
                    token: "variable.parameter",
                },
                {
                    foreground: "008080",
                    token: "support.variable",
                },
                {
                    foreground: "009999",
                    token: "constant.numeric",
                },
                {
                    foreground: "009999",
                    token: "constant.other",
                },
                {
                    foreground: "dd1144",
                    token: "string - string source",
                },
                {
                    foreground: "dd1144",
                    token: "constant.character",
                },
            ],
            colors: {
                "editor.foreground": "#000000",
                "editor.background": "#F8F8FF",
                "editor.selectionBackground": "#B4D5FE",
                "editor.lineHighlightBackground": "#F8F8FF",
                "editorCursor.foreground": "#666666",
                "editorWhitespace.foreground": "#BBBBBB",
            },
        });

        monaco.languages.register({ id: "custom" });
        let keywords = ["print", "if", "else", "while", "sleep", "send"];

        monaco.languages.setMonarchTokensProvider("custom", {
            keywords,
            tokenizer: {
                root: [
                    [
                        /@?[a-zA-Z][\w$]*/,
                        {
                            cases: {
                                "@keywords": "keyword",
                                "@default": "variable",
                            },
                        },
                    ],
                    [/'.*?'/, "string"],
                    [/\/\/.*/, "comment"],
                    [/\d+/, "constant.numeric"],
                ],
            },
        });

        monaco.languages.registerCompletionItemProvider("custom", {
            provideCompletionItems: (model, position) => {
                var word = model.getWordUntilPosition(position);
                var range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };
                var suggestions = [
                    {
                        label: "print",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "print('${1:text}');",
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: "if",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: ["if (${1:condition}) {", "\t$0", "}"].join(
                            "\n",
                        ),
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "If Statement",
                        range: range,
                    },
                    {
                        label: "if else",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            "if (${1:condition}) {",
                            "\t$0",
                            "} else {",
                            "\t$0",
                            "}",
                        ].join("\n"),
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "If Else Statement",
                        range: range,
                    },
                    {
                        label: "else",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: ["else {", "\t$0", "}"].join("\n"),
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Else Statement",
                        range: range,
                    },
                    {
                        label: "while",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            "while (${1:expression}) {",
                            "\t$0",
                            "}",
                        ].join("\n"),
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "While Statement",
                        range: range,
                    },
                    {
                        label: "send",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "send('${1:endpoint}');",
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Send request to the device",
                        range: range,
                    },
                    {
                        label: "send value",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "send('${1:endpoint}', ${2:value});",
                        insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Send request with value to the device",
                        range: range,
                    },
                ];
                return { suggestions: suggestions };
            },
        });

        editor = monaco.editor.create(editorContainer, {
            value: macro.code,
            language: "custom",
            theme,
        });
        loaded = true;
    }

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
    <Dialog.Portal>
        <Dialog.Content class="max-w-full h-full flex flex-col">
            <Dialog.Header class="">
                <Dialog.Title class="flex justify-between h-fit">
                    <div class="flex items-center">
                        <FileTerminal class="w-6 mr-2" />Editeur de macro
                    </div>
                    <h3>{macro.name}</h3>
                    <Button
                        type="submit"
                        on:click={() => {
                            onSave(macro.name, editor.getValue());
                            onClose();
                        }}
                    >
                        {$_("save")}
                    </Button>
                </Dialog.Title>
            </Dialog.Header>

            {#if !loaded}
                <div role="status" class="absolute top-1/2 left-1/2">
                    <svg
                        aria-hidden="true"
                        class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            {/if}
            <div class="h-full w-full" bind:this={editorContainer} />
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
