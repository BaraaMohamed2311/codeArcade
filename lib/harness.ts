import { Problem, Lang } from "./problems";

// Builds the full source file to send to the Piston execution API for a given
// language. JS/Python get a generic harness built from the test cases here.
// Go needs a fully typed driver, which is baked into each problem (goHarness).
export function buildSource(problem: Problem, lang: Lang, userCode: string): string {
  if (lang === "javascript") {
    const testsJson = JSON.stringify(problem.tests);
    return `${userCode}

const __tests = ${testsJson};
const __results = [];
for (const t of __tests) {
  try {
    const out = ${problem.fnName}(...t.input);
    __results.push({ pass: JSON.stringify(out) === JSON.stringify(t.expected), output: out });
  } catch (e) {
    __results.push({ pass: false, error: String(e && e.message ? e.message : e) });
  }
}
console.log("__RESULTS__" + JSON.stringify(__results));
`;
  }

  if (lang === "python") {
    // Build a python literal for tests using JSON (python's json module parses it directly).
    const testsJson = JSON.stringify(problem.tests);
    return `import json

${userCode}

__tests = json.loads(${JSON.stringify(testsJson)})
__results = []
for t in __tests:
    try:
        out = ${pyFnName(problem)}(*t["input"])
        __results.append({"pass": out == t["expected"], "output": out})
    except Exception as e:
        __results.append({"pass": False, "error": str(e)})

print("__RESULTS__" + json.dumps(__results))
`;
  }

  // go
  return problem.goHarness(userCode);
}

function pyFnName(problem: Problem): string {
  // convert camelCase fnName to snake_case, matching the starter/solution code convention
  return problem.fnName.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export interface RunResult {
  pass: boolean;
  output?: any;
  error?: string;
}

export interface RunResponse {
  ok: boolean;
  results?: RunResult[];
  stdout?: string;
  stderr?: string;
  compileError?: string;
  message?: string;
}
