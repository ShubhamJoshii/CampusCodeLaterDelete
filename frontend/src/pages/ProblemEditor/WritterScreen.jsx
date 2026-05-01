import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./ProblemEditor.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCode, updateCustomInput, updateSelectLanguage } from "../../redux/reducer/problemEditorSlice";
import { RestrictUser } from "../../CheckAuth";
import Split from 'react-split'

const WritterScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);


    const editorRef = useRef(null);
    const monacoRef = useRef(null);


    const { code, currentLanguage, problemDetails, output, result, isSubmitted } = useSelector(state => state.problemEditorDetails);
    const dispatch = useDispatch();

    // Mount editor
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }

    // useEffect(() => { console.log(result?.error || (result?.length && result[activeIndex])) }, [result])

    // Simple validation
    const validateCode = (code) => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;

        if (!editor || !monaco) return;

        const model = editor.getModel();
        const markers = [];

        if (!code.includes("class")) {
            markers.push({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 10,
                message: "Missing class keyword",
                severity: monaco.MarkerSeverity.Error,
            });
        }

        if (code.includes("int[]") && !code.includes("return")) {
            markers.push({
                startLineNumber: 3,
                startColumn: 1,
                endLineNumber: 3,
                endColumn: 20,
                message: "Missing return statement",
                severity: monaco.MarkerSeverity.Warning,
            });
        }

        monaco.editor.setModelMarkers(model, "owner", markers);
    };

    return (
        <div className="writtenScreen">
            <RestrictUser text="You need to be logged in to run code and submit solutions." style="flex-1 relative !h-[100%] bg-white" >
                <div className="code-header">
                    <span>Code</span>

                    <select
                        value={currentLanguage}
                        onChange={(e) => {
                            dispatch(updateSelectLanguage(e.target.value))
                            // dispatch(updateCode())
                        }}
                    >
                        <option value={"cpp"}>C++</option>
                        <option value={"java"}>Java</option>
                    </select>

                </div>

                <Split
                    sizes={[48, 52]}
                    expandToMin={false}
                    gutterSize={6} // Increased slightly for better mobile/touch accessibility
                    gutterAlign="center"
                    snapOffset={30}
                    dragInterval={1}
                    direction="vertical"
                    cursor="row-resize" // Changed from e-resize for vertical split
                    className="writterCodeSplit h-screen" // Ensure the parent has a height
                >
                    {/* Upper Section: Editor */}
                    <div className="w-full overflow-hidden">
                        <Editor
                            height="100%"
                            language={currentLanguage}
                            value={code[currentLanguage]?.text}
                            theme="vs"
                            onMount={handleEditorDidMount}
                            onChange={(value) => {
                                dispatch(updateCode(value || ""));
                                validateCode(value || "");
                            }}
                        />
                    </div>
                    {
                        (result?.error || (result?.length > 0 && result[activeIndex])) &&
                        <div className="overflow-y-auto bg-gray-50 p-4">
                            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                {result?.error && (
                                    <div className={`mb-3 rounded-md border p-3 text-sm font-semibold shadow-sm ${result?.success ? "border-green-600 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-800"
                                        }`}>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="font-semibold">Output</span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${result?.success ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
                                                }`}>
                                                {result?.success ? "Passed" : "Failed"}
                                            </span>
                                        </div>
                                        <pre className="mt-1 overflow-x-auto rounded bg-white/80 p-3 text-xs font-mono text-gray-800">
                                            {result.error}
                                        </pre>
                                    </div>
                                )}

                                {/* Test Case Tabs and Details */}
                                {result?.length > 0 && result[activeIndex] && (
                                    <>
                                        <div className="flex flex-wrap gap-2 justify-between">
                                            <div>
                                                {result.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveIndex(idx)}
                                                        className={`rounded-full mr-2 px-4 py-1 text-sm font-medium transition cursor-pointer ${activeIndex === idx ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                            }`}
                                                    >
                                                        Test {idx + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            {isSubmitted &&
                                                <span className={`flex justify-center items-center  text-sm font-medium px-2 py-0.5 rounded ${result?.success ? "bg-green-200 text-green-900" : "bg-green-200 text-green-900"
                                                    }`}>
                                                    Submitted
                                                </span>
                                            }
                                        </div>

                                        <div className="text-sm font-semibold text-gray-700">
                                            Input
                                            <pre className="mt-1 overflow-x-auto rounded bg-gray-100 p-3 text-xs font-mono text-gray-800">
                                                {result[activeIndex].input}
                                            </pre>
                                        </div>

                                        <div className="text-sm font-semibold text-gray-700">
                                            Expected
                                            <pre className="mt-1 overflow-x-auto rounded bg-gray-100 p-3 text-xs font-mono text-gray-800">
                                                {Array.isArray(result[activeIndex].expected)
                                                    ? result[activeIndex].expected.join(" ")
                                                    : result[activeIndex].expected}
                                            </pre>
                                        </div>

                                        <div className={`mb-3 rounded-md border p-3 text-sm font-bold shadow-sm   ${result[activeIndex].passed == true && "border-green-600 bg-green-200 text-green-900"} ${result[activeIndex].passed == false && "border-red-600 bg-red-50 text-red-800"}`}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-semibold">Actual Output</span>
                                                <div className="flex gap-2">
                                                    {(result[activeIndex]?.errorType || result[activeIndex]?.verdict) && (
                                                        <span className="text-xs bg-red-100 px-2 py-0.5 rounded text-red-900">
                                                            {result[activeIndex]?.errorType || result[activeIndex]?.verdict}
                                                        </span>
                                                    )}
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${result[activeIndex].passed ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
                                                        }`}>
                                                        {result[activeIndex].passed == true && "Passed"}
                                                        {result[activeIndex].passed == false && "Failed"}
                                                    </span>
                                                </div>
                                            </div>

                                            <pre className="mt-1 overflow-x-auto rounded bg-white/80 p-3 text-xs font-mono text-gray-800">
                                                {Array.isArray(result[activeIndex].actual)
                                                    ? result[activeIndex].actual.join(" ")
                                                    : result[activeIndex].actual}
                                                {result[activeIndex]?.error && `\nError: ${result[activeIndex].error}`}
                                            </pre>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    }

                </Split>
            </RestrictUser>
        </div>

    );
};

export default WritterScreen;