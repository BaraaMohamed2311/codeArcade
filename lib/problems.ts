export type Lang = "javascript" | "python" | "go";

export interface TestCase {
  input: any[];
  expected: any;
}

export interface Problem {
  slug: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string;
  prompt: string;
  fnName: string;
  starter: Record<Lang, string>;
  solution: Record<Lang, string>;
  tests: TestCase[];
  // For Go we need a fully typed harness per problem since Go has no generic JSON-free entry point.
  goHarness: (userCode: string) => string;
  complexity: { time: string; space: string };
  explanation: string; // child-level, no analogies
}

const twoSumGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Nums   []int \`json:"nums"\`
		Target int    \`json:"target"\`
		Want   []int  \`json:"want"\`
	}
	tests := []tc{
		{Nums: []int{2, 7, 11, 15}, Target: 9, Want: []int{0, 1}},
		{Nums: []int{3, 2, 4}, Target: 6, Want: []int{1, 2}},
		{Nums: []int{3, 3}, Target: 6, Want: []int{0, 1}},
	}
	type result struct {
		Pass   bool   \`json:"pass"\`
		Output []int  \`json:"output"\`
		Error  string \`json:"error,omitempty"\`
	}
	results := []result{}
	for _, t := range tests {
		out := twoSum(t.Nums, t.Target)
		pass := len(out) == len(t.Want) && out[0] == t.Want[0] && out[1] == t.Want[1]
		results = append(results, result{Pass: pass, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const longestSubstringGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		S    string
		Want int
	}
	tests := []tc{
		{S: "abcabcbb", Want: 3},
		{S: "bbbbb", Want: 1},
		{S: "pwwkew", Want: 3},
		{S: "", Want: 0},
	}
	type result struct {
		Pass   bool   \`json:"pass"\`
		Output int    \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := lengthOfLongestSubstring(t.S)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const containerGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Height []int
		Want   int
	}
	tests := []tc{
		{Height: []int{1, 8, 6, 2, 5, 4, 8, 3, 7}, Want: 49},
		{Height: []int{1, 1}, Want: 1},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := maxArea(t.Height)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const searchRotatedGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Nums   []int
		Target int
		Want   int
	}
	tests := []tc{
		{Nums: []int{4, 5, 6, 7, 0, 1, 2}, Target: 0, Want: 4},
		{Nums: []int{4, 5, 6, 7, 0, 1, 2}, Target: 3, Want: -1},
		{Nums: []int{1}, Target: 0, Want: -1},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := searchRotated(t.Nums, t.Target)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const mergeIntervalsGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func eq(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != 2 || len(b[i]) != 2 || a[i][0] != b[i][0] || a[i][1] != b[i][1] {
			return false
		}
	}
	return true
}

func main() {
	type tc struct {
		Intervals [][]int
		Want      [][]int
	}
	tests := []tc{
		{Intervals: [][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}, Want: [][]int{{1, 6}, {8, 10}, {15, 18}}},
		{Intervals: [][]int{{1, 4}, {4, 5}}, Want: [][]int{{1, 5}}},
	}
	type result struct {
		Pass   bool    \`json:"pass"\`
		Output [][]int \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := mergeIntervals(t.Intervals)
		results = append(results, result{Pass: eq(out, t.Want), Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const validParenGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		S    string
		Want bool
	}
	tests := []tc{
		{S: "()[]{}", Want: true},
		{S: "(]", Want: false},
		{S: "([)]", Want: false},
		{S: "{[]}", Want: true},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output bool \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := isValid(t.S)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const islandsGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Grid [][]string
		Want int
	}
	tests := []tc{
		{Grid: [][]string{{"1", "1", "0", "0"}, {"1", "1", "0", "0"}, {"0", "0", "1", "0"}, {"0", "0", "0", "1"}}, Want: 3},
		{Grid: [][]string{{"1", "0", "1"}, {"0", "1", "0"}, {"1", "0", "1"}}, Want: 5},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := numIslands(t.Grid)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const coinChangeGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Coins  []int
		Amount int
		Want   int
	}
	tests := []tc{
		{Coins: []int{1, 2, 5}, Amount: 11, Want: 3},
		{Coins: []int{2}, Amount: 3, Want: -1},
		{Coins: []int{1, 3, 4}, Amount: 6, Want: 2},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := coinChange(t.Coins, t.Amount)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const subsetsGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
	"sort"
)

${code}

func key(s []int) string {
	c := append([]int{}, s...)
	sort.Ints(c)
	b, _ := json.Marshal(c)
	return string(b)
}

func eqSetOfSets(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	am := map[string]int{}
	for _, s := range a {
		am[key(s)]++
	}
	bm := map[string]int{}
	for _, s := range b {
		bm[key(s)]++
	}
	if len(am) != len(bm) {
		return false
	}
	for k, v := range am {
		if bm[k] != v {
			return false
		}
	}
	return true
}

func main() {
	type tc struct {
		Nums []int
		Want [][]int
	}
	tests := []tc{
		{Nums: []int{1, 2, 3}, Want: [][]int{{}, {1}, {1, 2}, {1, 2, 3}, {1, 3}, {2}, {2, 3}, {3}}},
		{Nums: []int{0}, Want: [][]int{{}, {0}}},
	}
	type result struct {
		Pass   bool    \`json:"pass"\`
		Output [][]int \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := subsets(t.Nums)
		results = append(results, result{Pass: eqSetOfSets(out, t.Want), Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const topKGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
	"sort"
)

${code}

func eqAsSet(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	ac := append([]int{}, a...)
	bc := append([]int{}, b...)
	sort.Ints(ac)
	sort.Ints(bc)
	for i := range ac {
		if ac[i] != bc[i] {
			return false
		}
	}
	return true
}

func main() {
	type tc struct {
		Nums []int
		K    int
		Want []int
	}
	tests := []tc{
		{Nums: []int{1, 1, 1, 2, 2, 3}, K: 2, Want: []int{1, 2}},
		{Nums: []int{7}, K: 1, Want: []int{7}},
	}
	type result struct {
		Pass   bool  \`json:"pass"\`
		Output []int \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := topKFrequent(t.Nums, t.K)
		results = append(results, result{Pass: eqAsSet(out, t.Want), Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const binarySearchGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Arr    []int
		Target int
		Want   int
	}
	tests := []tc{
		{Arr: []int{-1, 0, 3, 5, 9, 12}, Target: 9, Want: 4},
		{Arr: []int{-1, 0, 3, 5, 9, 12}, Target: 2, Want: -1},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := binarySearch(t.Arr, t.Target)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const lowerBoundGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Arr    []int
		Target int
		Want   int
	}
	tests := []tc{
		{Arr: []int{1, 3, 5, 5, 7}, Target: 5, Want: 2},
		{Arr: []int{1, 3, 5, 5, 7}, Target: 6, Want: 4},
		{Arr: []int{1, 3, 5, 5, 7}, Target: 8, Want: 5},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := lowerBound(t.Arr, t.Target)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const maxLecturesGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Lectures [][]int
		Want     int
	}
	tests := []tc{
		{Lectures: [][]int{{1, 3}, {2, 4}, {3, 5}, {0, 6}, {5, 7}, {8, 9}, {5, 9}}, Want: 4},
		{Lectures: [][]int{{1, 2}, {1, 2}, {1, 2}}, Want: 1},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := maxLectures(t.Lectures)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const minHallsGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Lectures [][]int
		Want     int
	}
	tests := []tc{
		{Lectures: [][]int{{0, 30}, {5, 10}, {15, 20}}, Want: 2},
		{Lectures: [][]int{{7, 10}, {2, 4}}, Want: 1},
		{Lectures: [][]int{{1, 5}, {2, 6}, {3, 7}, {4, 8}}, Want: 4},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := minHalls(t.Lectures)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const reverseListGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func eqIntSlice(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func main() {
	type tc struct {
		List []int
		Want []int
	}
	tests := []tc{
		{List: []int{1, 2, 3, 4, 5}, Want: []int{5, 4, 3, 2, 1}},
		{List: []int{}, Want: []int{}},
	}
	type result struct {
		Pass   bool  \`json:"pass"\`
		Output []int \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := reverseList(t.List)
		results = append(results, result{Pass: eqIntSlice(out, t.Want), Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const detectCycleGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Next []int
		Head int
		Want bool
	}
	tests := []tc{
		{Next: []int{1, 2, 3, 1}, Head: 0, Want: true},
		{Next: []int{1, 2, -1}, Head: 0, Want: false},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output bool \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := hasCycle(t.Next, t.Head)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

// Tree node for Go tree problems. Trees are built directly in the harness
// (bespoke per problem, like all Go harnesses here) rather than decoded from
// JSON, since Go needs a concrete type.
const treeGoPrelude = `type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func buildTree1() *TreeNode {
	// [3,9,20,null,null,15,7]
	return &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}
}

func buildTree2() *TreeNode {
	// [1,null,2]
	return &TreeNode{Val: 1, Right: &TreeNode{Val: 2}}
}
`;

const maxDepthGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${treeGoPrelude}

${code}

func main() {
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	out1 := maxDepth(buildTree1())
	results = append(results, result{Pass: out1 == 3, Output: out1})
	out2 := maxDepth(buildTree2())
	results = append(results, result{Pass: out2 == 2, Output: out2})
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const levelOrderGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${treeGoPrelude}

${code}

func eqLevels(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func main() {
	type result struct {
		Pass   bool    \`json:"pass"\`
		Output [][]int \`json:"output"\`
	}
	results := []result{}
	out1 := levelOrder(buildTree1())
	results = append(results, result{Pass: eqLevels(out1, [][]int{{3}, {9, 20}, {15, 7}}), Output: out1})
	out2 := levelOrder(nil)
	results = append(results, result{Pass: eqLevels(out2, [][]int{}), Output: out2})
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const shortestPathGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	graph := map[string][]string{
		"A": {"B", "C"},
		"B": {"D"},
		"C": {"D"},
		"D": {"E"},
		"E": {},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	out1 := shortestPath(graph, "A", "E")
	results = append(results, result{Pass: out1 == 3, Output: out1})
	out2 := shortestPath(graph, "E", "A")
	results = append(results, result{Pass: out2 == -1, Output: out2})
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const robGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		Nums []int
		Want int
	}
	tests := []tc{
		{Nums: []int{1, 2, 3, 1}, Want: 4},
		{Nums: []int{2, 7, 9, 3, 1}, Want: 12},
		{Nums: []int{}, Want: 0},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output int  \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := rob(t.Nums)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

const canFinishGoHarness = (code: string) => `package main

import (
	"encoding/json"
	"fmt"
)

${code}

func main() {
	type tc struct {
		N    int
		Prereqs [][]int
		Want bool
	}
	tests := []tc{
		{N: 2, Prereqs: [][]int{{1, 0}}, Want: true},
		{N: 2, Prereqs: [][]int{{1, 0}, {0, 1}}, Want: false},
		{N: 4, Prereqs: [][]int{{1, 0}, {2, 1}, {3, 2}}, Want: true},
	}
	type result struct {
		Pass   bool \`json:"pass"\`
		Output bool \`json:"output"\`
	}
	results := []result{}
	for _, t := range tests {
		out := canFinish(t.N, t.Prereqs)
		results = append(results, result{Pass: out == t.Want, Output: out})
	}
	b, _ := json.Marshal(results)
	fmt.Println("__RESULTS__" + string(b))
}
`;

export const PROBLEMS: Problem[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    topic: "Hashing",
    difficulty: "Easy",
    pattern: "Hash Map lookup",
    prompt:
      "You get a list of numbers and a target number. Find the two numbers in the list that add up to the target. Return their positions (index), not the numbers themselves. Each input has exactly one answer, and you cannot use the same number twice.",
    fnName: "twoSum",
    starter: {
      javascript: `function twoSum(nums, target) {
  // write your code here
}`,
      python: `def two_sum(nums, target):
    # write your code here
    pass`,
      go: `func twoSum(nums []int, target int) []int {
	// write your code here
	return []int{}
}`,
    },
    solution: {
      javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return []`,
      go: `func twoSum(nums []int, target int) []int {
	seen := map[int]int{}
	for i, n := range nums {
		need := target - n
		if j, ok := seen[need]; ok {
			return []int{j, i}
		}
		seen[n] = i
	}
	return []int{}
}`,
    },
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
    goHarness: twoSumGoHarness,
    complexity: { time: "O(n)", space: "O(n)" },
    explanation:
      "We walk through the list one time. For each number, we work out what other number it needs to reach the target. We keep a note (a map) of every number we already saw and where it was. Before we save the current number, we check the note to see if its needed partner is already there. If it is, we found our two numbers right away. This way we never have to check every pair, we only check each number once.",
  },
  {
    slug: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    difficulty: "Medium",
    pattern: "Sliding window with last-seen map",
    prompt:
      "You get a string. Find the length of the longest piece of it, taken without skipping any letters, that has no repeated character inside it.",
    fnName: "lengthOfLongestSubstring",
    starter: {
      javascript: `function lengthOfLongestSubstring(s) {
  // write your code here
}`,
      python: `def length_of_longest_substring(s):
    # write your code here
    pass`,
      go: `func lengthOfLongestSubstring(s string) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      python: `def length_of_longest_substring(s):
    last_seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
      go: `func lengthOfLongestSubstring(s string) int {
	lastSeen := map[byte]int{}
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		ch := s[right]
		if idx, ok := lastSeen[ch]; ok && idx >= left {
			left = idx + 1
		}
		lastSeen[ch] = right
		if right-left+1 > best {
			best = right - left + 1
		}
	}
	return best
}`,
    },
    tests: [
      { input: ["abcabcbb"], expected: 3 },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3 },
      { input: [""], expected: 0 },
    ],
    goHarness: longestSubstringGoHarness,
    complexity: { time: "O(n)", space: "O(min(n, charset))" },
    explanation:
      "We keep a window of letters that has no repeats inside it, marked by a left edge and a right edge. We move the right edge forward one letter at a time. Each time we remember the last place we saw each letter. If the new letter was already inside our window, we move the left edge to just after where we saw it last, so the window stops having a repeat. After each step we check if this window is the longest one so far.",
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    topic: "Two Pointers",
    difficulty: "Medium",
    pattern: "Two pointers from both ends",
    prompt:
      "You get a list of wall heights. Pick two walls so that, together with the ground between them, they hold the most water. Return the amount of water held (width times the shorter wall).",
    fnName: "maxArea",
    starter: {
      javascript: `function maxArea(height) {
  // write your code here
}`,
      python: `def max_area(height):
    # write your code here
    pass`,
      go: `func maxArea(height []int) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    best = Math.max(best, width * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
      python: `def max_area(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        best = max(best, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best`,
      go: `func maxArea(height []int) int {
	left, right := 0, len(height)-1
	best := 0
	for left < right {
		width := right - left
		h := height[left]
		if height[right] < h {
			h = height[right]
		}
		if width*h > best {
			best = width * h
		}
		if height[left] < height[right] {
			left++
		} else {
			right--
		}
	}
	return best
}`,
    },
    tests: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { input: [[1, 1]], expected: 1 },
    ],
    goHarness: containerGoHarness,
    complexity: { time: "O(n)", space: "O(1)" },
    explanation:
      "We start with one pointer at the first wall and one at the last wall, so the gap between them is as wide as it can be. We work out the water held between the two current walls and keep the best amount we have seen. Then we move whichever wall is shorter one step inward, because the shorter wall is what is limiting the water, and keeping it would never help. We repeat until the two pointers meet.",
  },
  {
    slug: "search-rotated",
    title: "Search in Rotated Sorted Array",
    topic: "Binary Search",
    difficulty: "Medium",
    pattern: "Modified binary search on a rotated array",
    prompt:
      "You get a list of numbers that was sorted but then rotated at some unknown point, and a target number. Find the index of the target in the list. If it is not there, return -1. Your answer must look at far fewer than all the numbers.",
    fnName: "searchRotated",
    starter: {
      javascript: `function searchRotated(nums, target) {
  // write your code here
}`,
      python: `def search_rotated(nums, target):
    # write your code here
    pass`,
      go: `func searchRotated(nums []int, target int) int {
	// write your code here
	return -1
}`,
    },
    solution: {
      javascript: `function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      python: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      go: `func searchRotated(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		}
		if nums[lo] <= nums[mid] {
			if nums[lo] <= target && target < nums[mid] {
				hi = mid - 1
			} else {
				lo = mid + 1
			}
		} else {
			if nums[mid] < target && target <= nums[hi] {
				lo = mid + 1
			} else {
				hi = mid - 1
			}
		}
	}
	return -1
}`,
    },
    tests: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[1], 0], expected: -1 },
    ],
    goHarness: searchRotatedGoHarness,
    complexity: { time: "O(log n)", space: "O(1)" },
    explanation:
      "Even after the list was rotated, one half around the middle point is always still fully in order. We check the middle number first. Then we work out which half, left or right, is still in order, and check whether the target would fit inside that ordered half. If it fits there, we search only that half. If it does not fit, we search the other half. Every step throws away half of what is left, so we finish fast.",
  },
  {
    slug: "merge-intervals",
    title: "Merge Overlapping Intervals",
    topic: "Intervals / Greedy",
    difficulty: "Medium",
    pattern: "Sort by start, merge forward",
    prompt:
      "You get a list of time ranges, each with a start and an end. Some of them overlap. Merge all the ranges that overlap and return the smallest list of ranges that covers the same time.",
    fnName: "mergeIntervals",
    starter: {
      javascript: `function mergeIntervals(intervals) {
  // write your code here
}`,
      python: `def merge_intervals(intervals):
    # write your code here
    pass`,
      go: `func mergeIntervals(intervals [][]int) [][]int {
	// write your code here
	return [][]int{}
}`,
    },
    solution: {
      javascript: `function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const [start, end] = sorted[i];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}`,
      python: `def merge_intervals(intervals):
    if not intervals:
        return []
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    merged = [list(sorted_intervals[0])]
    for start, end in sorted_intervals[1:]:
        last = merged[-1]
        if start <= last[1]:
            last[1] = max(last[1], end)
        else:
            merged.append([start, end])
    return merged`,
      go: `import "sort"

func mergeIntervals(intervals [][]int) [][]int {
	if len(intervals) == 0 {
		return [][]int{}
	}
	sorted := append([][]int{}, intervals...)
	sort.Slice(sorted, func(i, j int) bool { return sorted[i][0] < sorted[j][0] })
	merged := [][]int{{sorted[0][0], sorted[0][1]}}
	for i := 1; i < len(sorted); i++ {
		last := merged[len(merged)-1]
		start, end := sorted[i][0], sorted[i][1]
		if start <= last[1] {
			if end > last[1] {
				merged[len(merged)-1][1] = end
			}
		} else {
			merged = append(merged, []int{start, end})
		}
	}
	return merged
}`,
    },
    tests: [
      {
        input: [
          [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        ],
        expected: [
          [1, 6],
          [8, 10],
          [15, 18],
        ],
      },
      {
        input: [
          [
            [1, 4],
            [4, 5],
          ],
        ],
        expected: [[1, 5]],
      },
    ],
    goHarness: mergeIntervalsGoHarness,
    complexity: { time: "O(n log n)", space: "O(n)" },
    explanation:
      "First we line up all the ranges in order of their start time. Overlapping ranges then sit next to each other. We walk through them one by one and only compare each new range with the last one we kept. If the new range starts before or exactly when the last one ends, they overlap, so we stretch the last one to cover both. If not, the new range starts a fresh group. Sorting is what makes this one simple pass possible.",
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    pattern: "Stack (last in, first out)",
    prompt:
      "You get a string made only of the characters ( ) [ ] { }. Say whether every opening bracket has a matching closing bracket in the right order, with nothing crossed.",
    fnName: "isValid",
    starter: {
      javascript: `function isValid(s) {
  // write your code here
}`,
      python: `def is_valid(s):
    # write your code here
    pass`,
      go: `func isValid(s string) bool {
	// write your code here
	return false
}`,
    },
    solution: {
      javascript: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return len(stack) == 0`,
      go: `func isValid(s string) bool {
	pairs := map[byte]byte{')': '(', ']': '[', '}': '{'}
	stack := []byte{}
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if open, ok := pairs[ch]; ok {
			if len(stack) == 0 || stack[len(stack)-1] != open {
				return false
			}
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, ch)
		}
	}
	return len(stack) == 0
}`,
    },
    tests: [
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false },
      { input: ["{[]}"], expected: true },
    ],
    goHarness: validParenGoHarness,
    complexity: { time: "O(n)", space: "O(n)" },
    explanation:
      "We go through the string one character at a time and keep a pile (a stack) of open brackets. Every time we see an opening bracket, we add it to the top of the pile. Every time we see a closing bracket, we check the top of the pile: it must be the matching opener. If it matches, we remove it from the pile. If it does not match, or the pile is empty, the string is not valid. At the very end, the pile must be empty, or some bracket was never closed.",
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    pattern: "DFS flood fill on a grid",
    prompt:
      "You get a grid of \"1\" (land) and \"0\" (water). Land cells that touch up, down, left, or right belong to the same island. Count how many separate islands are in the grid.",
    fnName: "numIslands",
    starter: {
      javascript: `function numIslands(grid) {
  // write your code here
}`,
      python: `def num_islands(grid):
    # write your code here
    pass`,
      go: `func numIslands(grid [][]string) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let islands = 0;
  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== "1") return;
    grid[r][c] = "0";
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") { islands++; sink(r, c); }
    }
  }
  return islands;
}`,
      python: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return
        if grid[r][c] != "1":
            return
        grid[r][c] = "0"
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                sink(r, c)
    return islands`,
      go: `func numIslands(grid [][]string) int {
	rows, cols := len(grid), len(grid[0])
	var sink func(r, c int)
	sink = func(r, c int) {
		if r < 0 || c < 0 || r >= rows || c >= cols {
			return
		}
		if grid[r][c] != "1" {
			return
		}
		grid[r][c] = "0"
		sink(r+1, c)
		sink(r-1, c)
		sink(r, c+1)
		sink(r, c-1)
	}
	islands := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if grid[r][c] == "1" {
				islands++
				sink(r, c)
			}
		}
	}
	return islands
}`,
    },
    tests: [
      {
        input: [
          [
            ["1", "1", "0", "0"],
            ["1", "1", "0", "0"],
            ["0", "0", "1", "0"],
            ["0", "0", "0", "1"],
          ],
        ],
        expected: 3,
      },
      {
        input: [
          [
            ["1", "0", "1"],
            ["0", "1", "0"],
            ["1", "0", "1"],
          ],
        ],
        expected: 5,
      },
    ],
    goHarness: islandsGoHarness,
    complexity: { time: "O(rows x cols)", space: "O(rows x cols)" },
    explanation:
      "We look at every cell in the grid in order. When we find land we have not counted yet, we count one new island, then spread out from that cell into every connected land cell next to it, turning each one into water as we go so it is never counted twice. This spreading step is called flood fill. Once a whole island is turned into water, we keep scanning the grid for the next piece of land that is still a '1'.",
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    pattern: "Bottom-up DP over amount",
    prompt:
      "You get a list of coin values and a target amount. Using as many coins as you like of any value, find the smallest number of coins that add up exactly to the amount. If it cannot be made, return -1.",
    fnName: "coinChange",
    starter: {
      javascript: `function coinChange(coins, amount) {
  // write your code here
}`,
      python: `def coin_change(coins, amount):
    # write your code here
    pass`,
      go: `func coinChange(coins []int, amount int) int {
	// write your code here
	return -1
}`,
    },
    solution: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coin_change(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return -1 if dp[amount] == float("inf") else dp[amount]`,
      go: `func coinChange(coins []int, amount int) int {
	const inf = 1 << 30
	dp := make([]int, amount+1)
	for i := 1; i <= amount; i++ {
		dp[i] = inf
	}
	for a := 1; a <= amount; a++ {
		for _, coin := range coins {
			if coin <= a && dp[a-coin]+1 < dp[a] {
				dp[a] = dp[a-coin] + 1
			}
		}
	}
	if dp[amount] == inf {
		return -1
	}
	return dp[amount]
}`,
    },
    tests: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1, 3, 4], 6], expected: 2 },
    ],
    goHarness: coinChangeGoHarness,
    complexity: { time: "O(amount x coins)", space: "O(amount)" },
    explanation:
      "We build up the answer for every amount from 0 up to the target, one step at a time, and save each answer so we never work it out twice. For each amount, we try every coin: if the coin fits, using it means one coin plus whatever the best answer was for the smaller remaining amount. We keep the smallest total we find. By the time we reach the target amount, its saved answer is already the smallest number of coins possible.",
  },
  {
    slug: "subsets",
    title: "Subsets (Power Set)",
    topic: "Backtracking",
    difficulty: "Medium",
    pattern: "Choose / explore / un-choose",
    prompt:
      "You get a list of different numbers. Return every possible group you can make from them, including the empty group and the group with everything in it.",
    fnName: "subsets",
    starter: {
      javascript: `function subsets(nums) {
  // write your code here
}`,
      python: `def subsets(nums):
    # write your code here
    pass`,
      go: `func subsets(nums []int) [][]int {
	// write your code here
	return [][]int{}
}`,
    },
    solution: {
      javascript: `function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
      python: `def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result`,
      go: `func subsets(nums []int) [][]int {
	result := [][]int{}
	var backtrack func(start int, path []int)
	backtrack = func(start int, path []int) {
		snapshot := append([]int{}, path...)
		result = append(result, snapshot)
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i])
			backtrack(i+1, path)
			path = path[:len(path)-1]
		}
	}
	backtrack(0, []int{})
	return result
}`,
    },
    tests: [
      {
        input: [[1, 2, 3]],
        expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]],
      },
      { input: [[0]], expected: [[], [0]] },
    ],
    goHarness: subsetsGoHarness,
    complexity: { time: "O(n x 2^n)", space: "O(n)" },
    explanation:
      "Every number is either put in a group or left out, so we build every group by making that choice one number at a time. We save the group so far at every step, even if it is empty or not finished. Then for each remaining number we add it in, explore further with it included, and afterward take it back out before trying the next number. Taking it back out is what lets us try every other combination too.",
  },
  {
    slug: "top-k-frequent",
    title: "Top K Frequent Elements",
    topic: "Hashing",
    difficulty: "Medium",
    pattern: "Frequency count + bucket sort",
    prompt:
      "You get a list of numbers and a number k. Return the k numbers that appear most often in the list, in any order.",
    fnName: "topKFrequent",
    starter: {
      javascript: `function topKFrequent(nums, k) {
  // write your code here
}`,
      python: `def top_k_frequent(nums, k):
    # write your code here
    pass`,
      go: `func topKFrequent(nums []int, k int) []int {
	// write your code here
	return []int{}
}`,
    },
    solution: {
      javascript: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, freq] of count) buckets[freq].push(val);
  const result = [];
  for (let f = buckets.length - 1; f > 0 && result.length < k; f--) {
    for (const val of buckets[f]) {
      result.push(val);
      if (result.length === k) break;
    }
  }
  return result;
}`,
      python: `def top_k_frequent(nums, k):
    count = {}
    for n in nums:
        count[n] = count.get(n, 0) + 1
    buckets = [[] for _ in range(len(nums) + 1)]
    for val, freq in count.items():
        buckets[freq].append(val)
    result = []
    for f in range(len(buckets) - 1, 0, -1):
        for val in buckets[f]:
            result.append(val)
            if len(result) == k:
                return result
    return result`,
      go: `func topKFrequent(nums []int, k int) []int {
	count := map[int]int{}
	for _, n := range nums {
		count[n]++
	}
	buckets := make([][]int, len(nums)+1)
	for val, freq := range count {
		buckets[freq] = append(buckets[freq], val)
	}
	result := []int{}
	for f := len(buckets) - 1; f > 0 && len(result) < k; f-- {
		for _, val := range buckets[f] {
			result = append(result, val)
			if len(result) == k {
				break
			}
		}
	}
	return result
}`,
    },
    tests: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[7], 1], expected: [7] },
    ],
    goHarness: topKGoHarness,
    complexity: { time: "O(n)", space: "O(n)" },
    explanation:
      "We first count how many times each number shows up, using a note that maps each number to its count. Then, instead of sorting (which takes longer), we make a row of buckets, one bucket for every possible count value, and drop each number into the bucket matching how many times it appeared. We then read the buckets from the highest count down to the lowest, collecting numbers until we have k of them.",
  },
  {
    slug: "binary-search",
    title: "Classic Binary Search",
    topic: "Binary Search",
    difficulty: "Easy",
    pattern: "Halve the search space each step",
    prompt:
      "You get a list of numbers that is already sorted, with no repeats, and a target number. Find the index of the target. If it is not in the list, return -1.",
    fnName: "binarySearch",
    starter: {
      javascript: `function binarySearch(arr, target) {
  // write your code here
}`,
      python: `def binary_search(arr, target):
    # write your code here
    pass`,
      go: `func binarySearch(arr []int, target int) int {
	// write your code here
	return -1
}`,
    },
    solution: {
      javascript: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      go: `func binarySearch(arr []int, target int) int {
	lo, hi := 0, len(arr)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if arr[mid] == target {
			return mid
		}
		if arr[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}`,
    },
    tests: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    ],
    goHarness: binarySearchGoHarness,
    complexity: { time: "O(log n)", space: "O(1)" },
    explanation:
      "We keep two markers, one at the start of the list and one at the end. We look at the number in the middle of that range. If it is the target, we are done. If it is smaller than the target, the target must be further right, so we move the start marker past the middle. If it is bigger, the target must be further left, so we move the end marker before the middle. Each check throws away half of what is left, so we find the answer fast.",
  },
  {
    slug: "lower-bound",
    title: "Lower Bound (First Index >= Target)",
    topic: "Binary Search",
    difficulty: "Medium",
    pattern: "Boundary binary search template",
    prompt:
      "You get a sorted list that may have repeated numbers, and a target number. Return the first index whose value is greater than or equal to the target. If no such value exists, return the length of the list.",
    fnName: "lowerBound",
    starter: {
      javascript: `function lowerBound(arr, target) {
  // write your code here
}`,
      python: `def lower_bound(arr, target):
    # write your code here
    pass`,
      go: `func lowerBound(arr []int, target int) int {
	// write your code here
	return len(arr)
}`,
    },
    solution: {
      javascript: `function lowerBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      python: `def lower_bound(arr, target):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
      go: `func lowerBound(arr []int, target int) int {
	lo, hi := 0, len(arr)
	for lo < hi {
		mid := lo + (hi-lo)/2
		if arr[mid] < target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}`,
    },
    tests: [
      { input: [[1, 3, 5, 5, 7], 5], expected: 2 },
      { input: [[1, 3, 5, 5, 7], 6], expected: 4 },
      { input: [[1, 3, 5, 5, 7], 8], expected: 5 },
    ],
    goHarness: lowerBoundGoHarness,
    complexity: { time: "O(log n)", space: "O(1)" },
    explanation:
      "We use a range that does not include its own end marker, so the end marker can stand for 'the answer might be past every real number'. If the middle value is too small, the answer must be to its right, so we move the start marker past it. If the middle value is big enough, it might be the answer itself, so we keep it by moving the end marker down to it instead of past it. When the two markers meet, that spot is the first index big enough.",
  },
  {
    slug: "max-lectures",
    title: "Maximum Number of Lectures in One Hall",
    topic: "Intervals / Greedy",
    difficulty: "Medium",
    pattern: "Greedy, sort by end time",
    prompt:
      "You get a list of lectures, each with a start and end time, and one hall. Pick as many lectures as possible so that none of the picked ones overlap. Return how many you can fit.",
    fnName: "maxLectures",
    starter: {
      javascript: `function maxLectures(lectures) {
  // write your code here
}`,
      python: `def max_lectures(lectures):
    # write your code here
    pass`,
      go: `func maxLectures(lectures [][]int) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function maxLectures(lectures) {
  const sorted = [...lectures].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}`,
      python: `def max_lectures(lectures):
    sorted_lectures = sorted(lectures, key=lambda x: x[1])
    count = 0
    last_end = float("-inf")
    for start, end in sorted_lectures:
        if start >= last_end:
            count += 1
            last_end = end
    return count`,
      go: `import "sort"

func maxLectures(lectures [][]int) int {
	sorted := append([][]int{}, lectures...)
	sort.Slice(sorted, func(i, j int) bool { return sorted[i][1] < sorted[j][1] })
	count := 0
	lastEnd := -1 << 30
	for _, l := range sorted {
		if l[0] >= lastEnd {
			count++
			lastEnd = l[1]
		}
	}
	return count
}`,
    },
    tests: [
      {
        input: [
          [
            [1, 3],
            [2, 4],
            [3, 5],
            [0, 6],
            [5, 7],
            [8, 9],
            [5, 9],
          ],
        ],
        expected: 4,
      },
      {
        input: [
          [
            [1, 2],
            [1, 2],
            [1, 2],
          ],
        ],
        expected: 1,
      },
    ],
    goHarness: maxLecturesGoHarness,
    complexity: { time: "O(n log n)", space: "O(n)" },
    explanation:
      "We line up the lectures by when they finish, earliest first. Then we go through them in that order and take a lecture whenever it starts after (or exactly when) the last lecture we took ends. Taking the lecture that finishes earliest always leaves the most room for more lectures afterward, so this simple rule ends up fitting in the largest possible number.",
  },
  {
    slug: "min-lecture-halls",
    title: "Minimum Lecture Halls Required",
    topic: "Intervals / Greedy",
    difficulty: "Medium",
    pattern: "Sweep line over start/end events",
    prompt:
      "You get a list of lectures, each with a start and end time. Find the smallest number of halls needed so that no two overlapping lectures ever share a hall.",
    fnName: "minHalls",
    starter: {
      javascript: `function minHalls(lectures) {
  // write your code here
}`,
      python: `def min_halls(lectures):
    # write your code here
    pass`,
      go: `func minHalls(lectures [][]int) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function minHalls(lectures) {
  const starts = lectures.map(l => l[0]).sort((a, b) => a - b);
  const ends = lectures.map(l => l[1]).sort((a, b) => a - b);
  let halls = 0, e = 0;
  for (const s of starts) {
    if (s >= ends[e]) e++;
    else halls++;
  }
  return halls;
}`,
      python: `def min_halls(lectures):
    starts = sorted(l[0] for l in lectures)
    ends = sorted(l[1] for l in lectures)
    halls = 0
    e = 0
    for s in starts:
        if s >= ends[e]:
            e += 1
        else:
            halls += 1
    return halls`,
      go: `import "sort"

func minHalls(lectures [][]int) int {
	starts := make([]int, len(lectures))
	ends := make([]int, len(lectures))
	for i, l := range lectures {
		starts[i] = l[0]
		ends[i] = l[1]
	}
	sort.Ints(starts)
	sort.Ints(ends)
	halls, e := 0, 0
	for _, s := range starts {
		if s >= ends[e] {
			e++
		} else {
			halls++
		}
	}
	return halls
}`,
    },
    tests: [
      {
        input: [
          [
            [0, 30],
            [5, 10],
            [15, 20],
          ],
        ],
        expected: 2,
      },
      {
        input: [
          [
            [7, 10],
            [2, 4],
          ],
        ],
        expected: 1,
      },
      {
        input: [
          [
            [1, 5],
            [2, 6],
            [3, 7],
            [4, 8],
          ],
        ],
        expected: 4,
      },
    ],
    goHarness: minHallsGoHarness,
    complexity: { time: "O(n log n)", space: "O(n)" },
    explanation:
      "The number of halls we need equals the most lectures that are ever happening at the same moment. We sort all the start times and all the end times separately. Then we walk through the start times in order: if the earliest lecture that is still running has already ended by the time the next one starts, that hall is free and gets reused. Otherwise every hall we have is busy, so we need one more.",
  },
  {
    slug: "reverse-linked-list",
    title: "Reverse a Linked List",
    topic: "Linked Lists",
    difficulty: "Easy",
    pattern: "In-place pointer rewiring",
    prompt:
      "You get a list of values representing a linked list, in order from the head. Reverse it and return the new order, using the same prev/curr/next pointer idea a real linked list reversal uses (shown here as a plain list for simplicity).",
    fnName: "reverseList",
    starter: {
      javascript: `function reverseList(list) {
  // write your code here
}`,
      python: `def reverse_list(list):
    # write your code here
    pass`,
      go: `func reverseList(list []int) []int {
	// write your code here
	return []int{}
}`,
    },
    solution: {
      javascript: `function reverseList(list) {
  const result = [];
  for (let i = list.length - 1; i >= 0; i--) {
    result.push(list[i]);
  }
  return result;
}`,
      python: `def reverse_list(list):
    result = []
    for i in range(len(list) - 1, -1, -1):
        result.append(list[i])
    return result`,
      go: `func reverseList(list []int) []int {
	result := []int{}
	for i := len(list) - 1; i >= 0; i-- {
		result = append(result, list[i])
	}
	return result
}`,
    },
    tests: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[]], expected: [] },
    ],
    goHarness: reverseListGoHarness,
    complexity: { time: "O(n)", space: "O(1) extra, not counting the output" },
    explanation:
      "In a real linked list, each node only knows what comes after it. To reverse it, we walk through once and flip each node so it points to the one before it instead of the one after it. We keep three markers as we go: the node we already flipped, the node we are flipping now, and the node that comes next (saved before we lose it). By the end, every pointer faces backward and the last node we flipped is the new start.",
  },
  {
    slug: "detect-cycle",
    title: "Detect a Cycle in a Linked List",
    topic: "Linked Lists",
    difficulty: "Medium",
    pattern: "Fast and slow pointers (Floyd's)",
    prompt:
      "A linked list is given as a 'next' list: next[i] is the index of the node after node i, or -1 if there is none. Starting from a head index, say whether the list loops back on itself anywhere.",
    fnName: "hasCycle",
    starter: {
      javascript: `function hasCycle(next, head) {
  // write your code here
}`,
      python: `def has_cycle(next, head):
    # write your code here
    pass`,
      go: `func hasCycle(next []int, head int) bool {
	// write your code here
	return false
}`,
    },
    solution: {
      javascript: `function hasCycle(next, head) {
  let slow = head, fast = head;
  while (fast !== -1 && next[fast] !== -1) {
    slow = next[slow];
    fast = next[next[fast]];
    if (slow === fast) return true;
  }
  return false;
}`,
      python: `def has_cycle(next, head):
    slow = fast = head
    while fast != -1 and next[fast] != -1:
        slow = next[slow]
        fast = next[next[fast]]
        if slow == fast:
            return True
    return False`,
      go: `func hasCycle(next []int, head int) bool {
	slow, fast := head, head
	for fast != -1 && next[fast] != -1 {
		slow = next[slow]
		fast = next[next[fast]]
		if slow == fast {
			return true
		}
	}
	return false
}`,
    },
    tests: [
      { input: [[1, 2, 3, 1], 0], expected: true },
      { input: [[1, 2, -1], 0], expected: false },
    ],
    goHarness: detectCycleGoHarness,
    complexity: { time: "O(n)", space: "O(1)" },
    explanation:
      "We send two walkers down the list at the same time, a slow one that moves one step at a time and a fast one that moves two steps at a time. If the list ends, the fast walker runs off the end first and we know there is no loop. If there is a loop, the fast walker enters it first and eventually laps the slow walker from behind, so at some point they land on the exact same node. That meeting is the proof a loop exists.",
  },
  {
    slug: "max-depth-binary-tree",
    title: "Maximum Depth of a Binary Tree",
    topic: "Trees",
    difficulty: "Easy",
    pattern: "DFS recursion with a null base case",
    prompt:
      "You get a binary tree, written as null or [value, leftSubtree, rightSubtree]. Return the number of nodes along the longest path from the root down to a leaf.",
    fnName: "maxDepth",
    starter: {
      javascript: `function maxDepth(root) {
  // root is null, or [value, left, right]
  // write your code here
}`,
      python: `def max_depth(root):
    # root is None, or [value, left, right]
    # write your code here
    pass`,
      go: `func maxDepth(root *TreeNode) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function maxDepth(root) {
  if (root === null) return 0;
  const [, left, right] = root;
  return 1 + Math.max(maxDepth(left), maxDepth(right));
}`,
      python: `def max_depth(root):
    if root is None:
        return 0
    _, left, right = root
    return 1 + max(max_depth(left), max_depth(right))`,
      go: `func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	left := maxDepth(root.Left)
	right := maxDepth(root.Right)
	if left > right {
		return 1 + left
	}
	return 1 + right
}`,
    },
    tests: [
      { input: [[3, [9, null, null], [20, [15, null, null], [7, null, null]]]], expected: 3 },
      { input: [[1, null, [2, null, null]]], expected: 2 },
    ],
    goHarness: maxDepthGoHarness,
    complexity: { time: "O(n)", space: "O(h), h = tree height" },
    explanation:
      "An empty tree has depth 0, which is our stopping point. For any other node, its depth is 1 (for itself) plus whichever of its two sides goes deeper. We work this out by asking the same question about the left side and the right side first, then taking the bigger of those two answers and adding 1. This is why the function calls itself: each call only needs to trust the answer from the smaller trees below it.",
  },
  {
    slug: "level-order-traversal",
    title: "Level Order Traversal",
    topic: "Trees",
    difficulty: "Medium",
    pattern: "BFS with a queue",
    prompt:
      "You get a binary tree, written as null or [value, leftSubtree, rightSubtree]. Return its values level by level, from the root down, each level as its own list, left to right.",
    fnName: "levelOrder",
    starter: {
      javascript: `function levelOrder(root) {
  // root is null, or [value, left, right]
  // write your code here
}`,
      python: `def level_order(root):
    # root is None, or [value, left, right]
    # write your code here
    pass`,
      go: `func levelOrder(root *TreeNode) [][]int {
	// write your code here
	return [][]int{}
}`,
    },
    solution: {
      javascript: `function levelOrder(root) {
  if (root === null) return [];
  const result = [];
  let queue = [root];
  while (queue.length > 0) {
    const level = [];
    const next = [];
    for (const node of queue) {
      const [val, left, right] = node;
      level.push(val);
      if (left) next.push(left);
      if (right) next.push(right);
    }
    result.push(level);
    queue = next;
  }
  return result;
}`,
      python: `def level_order(root):
    if root is None:
        return []
    result = []
    queue = [root]
    while queue:
        level = []
        nxt = []
        for node in queue:
            val, left, right = node
            level.append(val)
            if left:
                nxt.append(left)
            if right:
                nxt.append(right)
        result.append(level)
        queue = nxt
    return result`,
      go: `func levelOrder(root *TreeNode) [][]int {
	result := [][]int{}
	if root == nil {
		return result
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		level := []int{}
		next := []*TreeNode{}
		for _, node := range queue {
			level = append(level, node.Val)
			if node.Left != nil {
				next = append(next, node.Left)
			}
			if node.Right != nil {
				next = append(next, node.Right)
			}
		}
		result = append(result, level)
		queue = next
	}
	return result
}`,
    },
    tests: [
      {
        input: [[3, [9, null, null], [20, [15, null, null], [7, null, null]]]],
        expected: [[3], [9, 20], [15, 7]],
      },
      { input: [null], expected: [] },
    ],
    goHarness: levelOrderGoHarness,
    complexity: { time: "O(n)", space: "O(w), w = widest level" },
    explanation:
      "We keep a waiting line (a queue) of nodes we still need to visit, starting with just the root. Each round, every node currently in the line belongs to the same level, so we read all of their values together as one level, and at the same time collect their children into a new waiting line for the next round. We repeat this, round by round, until the waiting line is empty, which means we have visited every level.",
  },
  {
    slug: "shortest-path-bfs",
    title: "Shortest Path in an Unweighted Graph",
    topic: "Graphs",
    difficulty: "Medium",
    pattern: "BFS, level = distance",
    prompt:
      "You get a graph as a list of connections from each node to its neighbors, plus a start node and a target node. Return the smallest number of connections needed to get from start to target, or -1 if it cannot be reached.",
    fnName: "shortestPath",
    starter: {
      javascript: `function shortestPath(graph, start, target) {
  // graph is an object like { A: ["B", "C"], ... }
  // write your code here
}`,
      python: `def shortest_path(graph, start, target):
    # graph is a dict like { "A": ["B", "C"], ... }
    # write your code here
    pass`,
      go: `func shortestPath(graph map[string][]string, start, target string) int {
	// write your code here
	return -1
}`,
    },
    solution: {
      javascript: `function shortestPath(graph, start, target) {
  if (start === target) return 0;
  const visited = new Set([start]);
  const queue = [[start, 0]];
  let head = 0;
  while (head < queue.length) {
    const [node, dist] = queue[head++];
    for (const next of graph[node] || []) {
      if (visited.has(next)) continue;
      if (next === target) return dist + 1;
      visited.add(next);
      queue.push([next, dist + 1]);
    }
  }
  return -1;
}`,
      python: `def shortest_path(graph, start, target):
    if start == target:
        return 0
    visited = {start}
    queue = [(start, 0)]
    head = 0
    while head < len(queue):
        node, dist = queue[head]
        head += 1
        for nxt in graph.get(node, []):
            if nxt in visited:
                continue
            if nxt == target:
                return dist + 1
            visited.add(nxt)
            queue.append((nxt, dist + 1))
    return -1`,
      go: `func shortestPath(graph map[string][]string, start, target string) int {
	if start == target {
		return 0
	}
	visited := map[string]bool{start: true}
	type item struct {
		node string
		dist int
	}
	queue := []item{{start, 0}}
	head := 0
	for head < len(queue) {
		cur := queue[head]
		head++
		for _, next := range graph[cur.node] {
			if visited[next] {
				continue
			}
			if next == target {
				return cur.dist + 1
			}
			visited[next] = true
			queue = append(queue, item{next, cur.dist + 1})
		}
	}
	return -1
}`,
    },
    tests: [
      {
        input: [{ A: ["B", "C"], B: ["D"], C: ["D"], D: ["E"], E: [] }, "A", "E"],
        expected: 3,
      },
      {
        input: [{ A: ["B", "C"], B: ["D"], C: ["D"], D: ["E"], E: [] }, "E", "A"],
        expected: -1,
      },
    ],
    goHarness: shortestPathGoHarness,
    complexity: { time: "O(V + E)", space: "O(V)" },
    explanation:
      "We explore the graph in rings spreading out from the start node: first its direct neighbors, then their neighbors, and so on, using a waiting line to keep the order straight. Because we always finish one full ring before starting the next, the very first time we reach the target, it is guaranteed to be by the shortest possible number of steps. We also mark each node as visited the moment we plan to visit it, so we never process the same node twice.",
  },
  {
    slug: "house-robber",
    title: "House Robber",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    pattern: "1D DP, take or skip",
    prompt:
      "You get a list of amounts of money in houses along a street. You cannot rob two houses that are next to each other. Return the largest total you can rob.",
    fnName: "rob",
    starter: {
      javascript: `function rob(nums) {
  // write your code here
}`,
      python: `def rob(nums):
    # write your code here
    pass`,
      go: `func rob(nums []int) int {
	// write your code here
	return 0
}`,
    },
    solution: {
      javascript: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const money of nums) {
    const current = Math.max(prev1, prev2 + money);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      python: `def rob(nums):
    prev2, prev1 = 0, 0
    for money in nums:
        current = max(prev1, prev2 + money)
        prev2 = prev1
        prev1 = current
    return prev1`,
      go: `func rob(nums []int) int {
	prev2, prev1 := 0, 0
	for _, money := range nums {
		current := prev1
		if prev2+money > current {
			current = prev2 + money
		}
		prev2 = prev1
		prev1 = current
	}
	return prev1
}`,
    },
    tests: [
      { input: [[1, 2, 3, 1]], expected: 4 },
      { input: [[2, 7, 9, 3, 1]], expected: 12 },
      { input: [[]], expected: 0 },
    ],
    goHarness: robGoHarness,
    complexity: { time: "O(n)", space: "O(1)" },
    explanation:
      "At each house we only have two real choices: skip it and keep whatever our best total was already, or rob it and add its money to our best total from two houses back (since the house right before it had to stay unrobbed). We only ever need those last two best totals, not the whole street, so we carry them forward as we go and update them one house at a time. By the final house, we are holding the best possible total.",
  },
  {
    slug: "course-schedule",
    title: "Course Schedule",
    topic: "Graphs",
    difficulty: "Medium",
    pattern: "Topological sort (Kahn's algorithm)",
    prompt:
      "There are n courses numbered 0 to n-1. Each pair [a, b] in the prerequisites list means you must take course b before course a. Return whether it is possible to finish every course.",
    fnName: "canFinish",
    starter: {
      javascript: `function canFinish(n, prerequisites) {
  // write your code here
}`,
      python: `def can_finish(n, prerequisites):
    # write your code here
    pass`,
      go: `func canFinish(n int, prerequisites [][]int) bool {
	// write your code here
	return false
}`,
    },
    solution: {
      javascript: `function canFinish(n, prerequisites) {
  const graph = Array.from({ length: n }, () => []);
  const inDegree = new Array(n).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);
  let taken = 0, head = 0;
  while (head < queue.length) {
    const c = queue[head++];
    taken++;
    for (const next of graph[c]) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }
  return taken === n;
}`,
      python: `def can_finish(n, prerequisites):
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    for course, pre in prerequisites:
        graph[pre].append(course)
        in_degree[course] += 1
    queue = [i for i in range(n) if in_degree[i] == 0]
    taken = 0
    head = 0
    while head < len(queue):
        c = queue[head]
        head += 1
        taken += 1
        for nxt in graph[c]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                queue.append(nxt)
    return taken == n`,
      go: `func canFinish(n int, prerequisites [][]int) bool {
	graph := make([][]int, n)
	inDegree := make([]int, n)
	for _, p := range prerequisites {
		course, pre := p[0], p[1]
		graph[pre] = append(graph[pre], course)
		inDegree[course]++
	}
	queue := []int{}
	for i := 0; i < n; i++ {
		if inDegree[i] == 0 {
			queue = append(queue, i)
		}
	}
	taken, head := 0, 0
	for head < len(queue) {
		c := queue[head]
		head++
		taken++
		for _, next := range graph[c] {
			inDegree[next]--
			if inDegree[next] == 0 {
				queue = append(queue, next)
			}
		}
	}
	return taken == n
}`,
    },
    tests: [
      { input: [2, [[1, 0]]], expected: true },
      {
        input: [
          2,
          [
            [1, 0],
            [0, 1],
          ],
        ],
        expected: false,
      },
      {
        input: [
          4,
          [
            [1, 0],
            [2, 1],
            [3, 2],
          ],
        ],
        expected: true,
      },
    ],
    goHarness: canFinishGoHarness,
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    explanation:
      "Every course keeps count of how many prerequisites it is still waiting on. We start with the courses that need nothing first and put them in a waiting line. Each time we take a course off the line, we tell every course that depended on it that one of its requirements is now done, lowering its waiting count by one. Any course whose count reaches zero joins the line too. If we manage to take every single course this way, there was no deadlock; if some are left stuck waiting on each other, finishing all of them is impossible.",
  },
];

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}
