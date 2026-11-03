// Pattern cheat sheet: memorize these shapes and you can derive most of
// the problems in the arcade from them. Each pattern has one canonical JS
// implementation (the shape is what matters — the same structure drops into
// Python or Go with that language's queue/stack/map), plus a one-line note
// per problem on exactly what was tweaked to turn the base pattern into that
// specific problem.

export interface PatternUsage {
  slug: string;
  title: string;
  tweak: string;
}

export type Level = "Easy" | "Medium" | "Hard";

// One row of the "problems and tweaks" table. slug is set only when the
// problem exists in the arcade (it then renders as a link).
export interface PatternProblem {
  level: Level;
  problem: string;
  tweak: string;
  slug?: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  code: string;
  // Plain-language problem the code above was written to solve. Explains why
  // the template is shaped the way it is.
  scenario?: string;
  // Problems ordered Easy -> Hard, first row is the scenario's own problem.
  // When present it replaces the plain usedBy table on the page.
  problemTable?: PatternProblem[];
  usedBy: PatternUsage[];
}

export const PATTERNS: Pattern[] = [
  {
    id: "hashmap-lookup",
    name: "Hash Map Lookup",
    description:
      "Walk the data once, keeping a map of what you've already seen so you never have to re-scan for a partner value.",
    code: `function hashLookup(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    scenario:
      "You get a list of numbers and a target number. Find the two positions whose numbers add up to the target. Exactly one answer exists, and you may not use the same position twice.",
    problemTable: [
      {
        level: "Easy",
        problem: "Two Sum",
        slug: "two-sum",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Contains Duplicate",
        tweak:
          "Drop the target math. Use a Set and return true as soon as seen.has(nums[i]) is true.",
      },
      {
        level: "Easy",
        problem: "Valid Anagram",
        tweak:
          "Use the map as a letter counter: +1 for each letter of the first string, -1 for each letter of the second. Every count must end at 0.",
      },
      {
        level: "Medium",
        problem: "Group Anagrams",
        tweak:
          "Make the map key the letters of each word sorted (or a 26-count signature) and the value a list of words that share that key.",
      },
      {
        level: "Medium",
        problem: "Subarray Sum Equals K",
        tweak:
          "Store prefix-sum counts in the map. At each step the partner you look up is (runningSum - k), and you add its count to the answer.",
      },
      {
        level: "Medium",
        problem: "Longest Consecutive Sequence",
        tweak:
          "Put every number in a Set. Only start counting from numbers whose predecessor (x - 1) is not in the Set, then walk upward.",
      },
      {
        level: "Medium",
        problem: "Top K Frequent Elements",
        tweak:
          "First pass counts frequencies in the map. Second step buckets numbers by their count (or uses a heap) and reads the top k.",
      },
      {
        level: "Hard",
        problem: "Max Points on a Line",
        tweak:
          "For each anchor point, use a map from the reduced slope to a count of points. The best line through that anchor is the largest count plus one.",
      },
    ],
    usedBy: [
      {
        slug: "two-sum",
        title: "Two Sum",
        tweak: "This is the base template, unchanged.",
      },
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description:
      "Keep a left and right edge over the data. Grow the window from the right; shrink it from the left only when it breaks a rule. Track the best window seen.",
    code: `function slidingWindow(s) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1; // jump left past the repeat
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    scenario:
      "You get a string. Find the length of the longest stretch of consecutive characters in which no character appears twice.",
    problemTable: [
      {
        level: "Medium",
        problem: "Longest Substring Without Repeating Characters",
        slug: "longest-substring",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Best Time to Buy and Sell Stock",
        tweak:
          "Replace lastSeen with a single value. When prices[right] is lower than prices[left], jump left to right. Track the biggest prices[right] - prices[left].",
      },
      {
        level: "Easy",
        problem: "Maximum Average Subarray I",
        tweak:
          "Fixed-size window. Keep a running sum, add arr[right], and once the window is larger than k, subtract arr[right - k].",
      },
      {
        level: "Medium",
        problem: "Longest Repeating Character Replacement",
        tweak:
          "Keep letter counts in the window. The window is valid while (size - highest count) <= k; otherwise move left forward by one.",
      },
      {
        level: "Medium",
        problem: "Permutation in String",
        tweak:
          "Fixed window the length of the pattern. Slide it and compare the letter counts with the pattern's counts at each step.",
      },
      {
        level: "Medium",
        problem: "Longest Substring with At Most K Distinct Characters",
        tweak:
          "Keep a count per character in the window and move the left edge forward while the number of distinct characters is above k.",
      },
      {
        level: "Medium",
        problem: "Minimum Size Subarray Sum",
        tweak:
          "Shrink instead of grow. Whenever the window sum is >= target, record the length and move left forward, repeating while it stays valid.",
      },
      {
        level: "Hard",
        problem: "Minimum Window Substring",
        tweak:
          "Keep need and have counters. Once the window covers every needed character, shrink from the left as far as it stays valid and record the smallest window.",
      },
      {
        level: "Hard",
        problem: "Sliding Window Maximum",
        tweak:
          "Fixed window plus a monotonic deque of indices (values decreasing). Pop from the back while smaller, pop from the front when it leaves the window.",
      },
    ],
    usedBy: [
      {
        slug: "longest-substring",
        title: "Longest Substring Without Repeating Characters",
        tweak: "This is the base template. The one line to memorize is left = lastSeen[ch] + 1: when the new character repeats inside the window, jump the left edge just past its previous position.",
      },
    ],
  },
  {
    id: "two-pointers",
    name: "Two Pointers (Converging)",
    description:
      "One pointer at each end, moving inward. At each step, decide which side to move based on which one is the limiting factor.",
    code: `function twoPointers(arr) {
  let left = 0, right = arr.length - 1, best = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(arr[left], arr[right]);
    best = Math.max(best, width * h);
    if (arr[left] < arr[right]) left++;
    else right--;
  }
  return best;
}`,
    scenario:
      "You get a list of wall heights. Pick two walls that, together with the floor, hold the most water. Return that amount.",
    problemTable: [
      {
        level: "Medium",
        problem: "Container With Most Water",
        slug: "container-with-most-water",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Valid Palindrome",
        tweak:
          "No area calculation. Skip non-alphanumeric characters, compare s[left] and s[right], and move both pointers inward.",
      },
      {
        level: "Easy",
        problem: "Reverse String",
        tweak:
          "Swap arr[left] and arr[right], then move both pointers inward until they meet.",
      },
      {
        level: "Easy",
        problem: "Squares of a Sorted Array",
        tweak:
          "Compare abs(arr[left]) with abs(arr[right]), place the larger square at the back of the result, and move that pointer inward.",
      },
      {
        level: "Medium",
        problem: "Two Sum II (Sorted Input)",
        tweak:
          "Compare arr[left] + arr[right] with the target. Move left if the sum is too small, move right if it is too big.",
      },
      {
        level: "Medium",
        problem: "3Sum",
        tweak:
          "Sort, fix one number with a loop, then run the converging pointers on the rest for the remaining sum. Skip duplicate values.",
      },
      {
        level: "Medium",
        problem: "Sort Colors",
        tweak:
          "Three pointers instead of two: low, mid and high. Swap 0s toward low and 2s toward high, and only advance mid when the swapped-in value is settled.",
      },
      {
        level: "Hard",
        problem: "Trapping Rain Water",
        tweak:
          "Track leftMax and rightMax. Move the pointer on the side with the smaller max, and add (that max - the height there) as trapped water.",
      },
    ],
    usedBy: [
      {
        slug: "container-with-most-water",
        title: "Container With Most Water",
        tweak: "This is the base template. The one line to memorize is the move rule: always move the pointer at the SHORTER wall inward, because the shorter wall is what limits the area.",
      },
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search (Exact Match)",
    description:
      "Halve the search range every step. Compare the middle element with the target, throw away the half that cannot contain it, and stop when the range is empty.",
    code: `function binarySearchExact(arr, target) {
  let left = 0; 
  let right = arr.length - 1;

  while (left <= right) { // Note: <= is needed here to check the last remaining element
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      return mid; // Found it!
    } 
    else if (arr[mid] < target) {
      left = mid + 1; // Target is bigger, throw away the left half and go RIGHT
    } 
    else {
      right = mid - 1; // Target is smaller, throw away the right half and go LEFT
    }
  }

  return -1; // Target doesn't exist in the array
}`,
    scenario:
      "You get a list of numbers that is already sorted, with no repeats, and a target number. Find the index of the target. If it is not in the list, return -1.",
    problemTable: [
      {
        level: "Easy",
        problem: "Classic Binary Search",
        slug: "binary-search",
        tweak: "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Search Insert Position",
        tweak:
          "Return left instead of -1. When the loop ends, left is exactly where the target would be inserted.",
      },
      {
        level: "Easy",
        problem: "Sqrt(x)",
        tweak:
          "Search over the possible answers 0..x instead of an array. Compare mid * mid with x, and return right when the loop ends (the largest value whose square fits).",
      },
      {
        level: "Medium",
        problem: "Lower Bound (First Index >= Target)",
        slug: "lower-bound",
        tweak:
          "Do not return on a match. Use left < right, set right = mid when arr[mid] >= target, otherwise left = mid + 1, and return left. Only that one comparison decides which half to keep.",
      },
      {
        level: "Medium",
        problem: "First / Last Occurrence (with duplicates)",
        tweak:
          "On a match, save mid as the answer but keep searching: go left (right = mid - 1) for the first occurrence, or right (left = mid + 1) for the last.",
      },
      {
        level: "Medium",
        problem: "Find Minimum in Rotated Sorted Array",
        tweak:
          "Use left < right and compare arr[mid] with arr[right]. If arr[mid] > arr[right] the minimum is to the right (left = mid + 1), otherwise right = mid. Return arr[left].",
      },
      {
        level: "Medium",
        problem: "Search in Rotated Sorted Array",
        slug: "search-rotated",
        tweak:
          "Before comparing with the target, work out which half (left..mid or mid..right) is still sorted. Check whether the target falls inside that sorted half, and keep or discard it accordingly.",
      },
      {
        level: "Medium",
        problem: "Koko Eating Bananas",
        tweak:
          "Binary search on the answer (the eating speed), not on an array. Replace the arr[mid] comparison with a canFinish(mid) check and shrink toward the smallest speed that works.",
      },
      {
        level: "Hard",
        problem: "Median of Two Sorted Arrays",
        tweak:
          "Binary search on the partition point of the smaller array. The partition is correct when the largest value on the left side of both arrays is <= the smallest value on the right side.",
      },
    ],
    usedBy: [
      {
        slug: "lower-bound",
        title: "Lower Bound (First Index >= Target)",
        tweak:
          "Do not return on a match. Use left < right, set right = mid when arr[mid] >= target, otherwise left = mid + 1, and return left.",
      },
      {
        slug: "binary-search",
        title: "Classic Binary Search",
        tweak: "This is the base template, unchanged.",
      },
      {
        slug: "search-rotated",
        title: "Search in Rotated Sorted Array",
        tweak:
          "Before comparing to the target, first work out which half (left or right of mid) is still in sorted order, then only trust the comparison within that sorted half.",
      },
    ],
  },
  {
    id: "backtracking",
    name: "Backtracking (Choose / Explore / Un-choose)",
    description:
      "Build a partial answer, record it (or keep going), try every next choice, recurse, then undo the choice before trying the next one.",
    code: `function backtrack(nums, start, path, result) {
  result.push([...path]); // record every path, not just full ones
  for (let i = start; i < nums.length; i++) {
    path.push(nums[i]);        // choose
    backtrack(nums, i + 1, path, result); // explore
    path.pop();                // un-choose
  }
}`,
    scenario:
      "You get a list of distinct numbers. Return every possible subset, including the empty one and the full list.",
    problemTable: [
      {
        level: "Medium",
        problem: "Subsets (Power Set)",
        slug: "subsets",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Medium",
        problem: "Combinations",
        tweak:
          "Only record when path.length === k instead of at every call, and stop early when there are not enough numbers left to fill the path.",
      },
      {
        level: "Medium",
        problem: "Subsets II (with duplicates)",
        tweak:
          "Sort first, then skip a number when i > start and nums[i] === nums[i - 1] so the same value is not chosen twice at the same depth.",
      },
      {
        level: "Medium",
        problem: "Combination Sum",
        tweak:
          "Record when the remaining sum hits 0, stop when it goes below 0, and recurse with i instead of i + 1 so a number can be reused.",
      },
      {
        level: "Medium",
        problem: "Permutations",
        tweak:
          "No start index. Loop from 0 every call, skip numbers already used (used[] or a Set), and record only when path.length === nums.length.",
      },
      {
        level: "Medium",
        problem: "Generate Parentheses",
        tweak:
          "The choices are '(' and ')' instead of a loop. Add '(' while open < n, add ')' while close < open, and record at length 2n.",
      },
      {
        level: "Medium",
        problem: "Word Search",
        tweak:
          "The choices are the four neighbors on a grid. Mark the cell visited before exploring, unmark it after, and stop on a mismatch or out-of-bounds.",
      },
      {
        level: "Hard",
        problem: "N-Queens",
        tweak:
          "Each call places one row. Track used columns and both diagonals in Sets, try every column, and record the board when row === n.",
      },
    ],
    usedBy: [
      {
        slug: "subsets",
        title: "Subsets (Power Set)",
        tweak:
          "This is the base template. Record a copy of the current path at the very start of every call (every partial path is a valid subset), then loop over the remaining choices: choose, recurse, undo.",
      },
    ],
  },
  {
    id: "dp-1d",
    name: "1D Dynamic Programming",
    description:
      "Build the answer for every size from the smallest up to the target, reusing answers you already solved instead of recomputing them.",
    code: `function climbStairs(n) {
  const table = new Array(n + 1).fill(0); // table[i] = answer for size i
  table[0] = 1; // BASE: one way to stand at the bottom (do nothing)
  for (let i = 1; i <= n; i++) {
    // TRANSITION: build size i from smaller sizes already solved.
    // You arrive from one step below or two steps below.
    table[i] = table[i - 1] + (i >= 2 ? table[i - 2] : 0);
  }
  return table[n];
}`,
    scenario:
      "You are at the bottom of a staircase with n steps. Each move climbs 1 or 2 steps. Return how many different sequences of moves reach the top.",
    problemTable: [
      {
        level: "Easy",
        problem: "Climbing Stairs",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Min Cost Climbing Stairs",
        tweak:
          "The table holds the cheapest cost to stand on step i, with table[0] = table[1] = 0. The transition is min(table[i-1] + cost[i-1], table[i-2] + cost[i-2]).",
      },
      {
        level: "Medium",
        problem: "House Robber",
        slug: "house-robber",
        tweak:
          "The transition is max(table[i-1], table[i-2] + nums[i-1]). Each step only looks back two values, so the array collapses into two rolling variables.",
      },
      {
        level: "Medium",
        problem: "Decode Ways",
        tweak:
          "table[i] counts the ways to decode the first i characters. Add table[i-1] if the last digit is not '0', and add table[i-2] if the last two digits are 10 to 26.",
      },
      {
        level: "Medium",
        problem: "Coin Change",
        slug: "coin-change",
        tweak:
          "The table holds the fewest coins for each amount, so start it at Infinity (not 0) with table[0] = 0. The transition tries every coin and keeps the smallest table[i - coin] + 1.",
      },
      {
        level: "Medium",
        problem: "Word Break",
        tweak:
          "table[i] is a boolean for the first i characters. It is true if some j < i has table[j] true and s.slice(j, i) is in the word set. table[0] = true.",
      },
      {
        level: "Medium",
        problem: "Longest Increasing Subsequence",
        tweak:
          "table[i] is the best length ending at index i, starting at 1. The transition looks at every j < i with nums[j] < nums[i] and takes 1 + max table[j]. The answer is the biggest entry, not table[n].",
      },
      {
        level: "Hard",
        problem: "Longest Valid Parentheses",
        tweak:
          "table[i] is the length of the longest valid substring ending at i. It stays 0 when s[i] is '('. For ')', pair it with the matching '(' at i - table[i-1] - 1 and add the table value just before that match.",
      },
    ],
    usedBy: [
      {
        slug: "coin-change",
        title: "Coin Change",
        tweak:
          "The table holds the fewest coins for each amount, so start it at Infinity (not 0) with table[0] = 0. The transition tries every coin and keeps the smallest table[i - coin] + 1.",
      },
      {
        slug: "house-robber",
        title: "House Robber",
        tweak:
          "The transition is max(table[i-1], table[i-2] + nums[i-1]). Each step only looks back two values, so the array collapses into two rolling variables.",
      },
    ],
  },
  {
    id: "greedy-intervals",
    name: "Greedy over Sorted Intervals",
    description:
      "Sort the intervals first (by start or by end, depending on the question), then sweep through once making the locally-best choice at each step.",
    code: `function greedyIntervals(intervals) {
  // sort by END time for "fit the most in"
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}`,
    scenario:
      "You get a list of lectures, each with a start and an end time, and only one hall. Pick the largest number of lectures you can attend without any two of them overlapping.",
    problemTable: [
      {
        level: "Medium",
        problem: "Maximum Number of Lectures in One Hall",
        slug: "max-lectures",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Meeting Rooms (Can Attend All?)",
        tweak:
          "Sort by start time and return false as soon as a start is before the previous end. No counting needed.",
      },
      {
        level: "Medium",
        problem: "Non-overlapping Intervals (Minimum Removals)",
        tweak:
          "Run the base template unchanged and return (total - count), since the removed intervals are exactly those you did not keep.",
      },
      {
        level: "Medium",
        problem: "Merge Overlapping Intervals",
        slug: "merge-intervals",
        tweak:
          "Sort by START time. Instead of counting picks, stretch the last kept interval's end whenever the next one overlaps it.",
      },
      {
        level: "Medium",
        problem: "Minimum Lecture Halls Required",
        slug: "min-lecture-halls",
        tweak:
          "Sort all starts and all ends separately and sweep them together. The most lectures in progress at once is the answer.",
      },
      {
        level: "Medium",
        problem: "Insert Interval",
        tweak:
          "Already sorted, so no sort. Copy everything ending before the new one, merge everything that overlaps it, then copy the rest.",
      },
      {
        level: "Medium",
        problem: "Minimum Arrows to Burst Balloons",
        tweak:
          "Sort by END. Shoot an arrow at the first end, then start a new arrow only when a balloon's start is past the last arrow position.",
      },
      {
        level: "Hard",
        problem: "Minimum Interval to Include Each Query",
        tweak:
          "Sort intervals and queries. Sweep queries in order, push matching intervals onto a min-heap by length, and pop those that end before the query.",
      },
    ],
    usedBy: [
      {
        slug: "max-lectures",
        title: "Maximum Number of Lectures in One Hall",
        tweak: "This is the base template. Sort by END time, then take a lecture whenever its start is at or after the end of the last one you took.",
      },
      {
        slug: "merge-intervals",
        title: "Merge Overlapping Intervals",
        tweak:
          "Sort by START time instead of end time. Instead of counting non-overlapping picks, stretch the last kept interval's end whenever the next one overlaps it.",
      },
      {
        slug: "min-lecture-halls",
        title: "Minimum Lecture Halls Required",
        tweak:
          "Instead of one greedy pass over the intervals themselves, sort all the starts and all the ends separately, then sweep them together — counting how many are 'in progress' at once is the sweep-line version of the same greedy idea.",
      },
    ],
  },
  {
    id: "stack-matching",
    name: "Stack Matching",
    description:
      "Push openers onto a stack. On a closer, the top of the stack must be its matching opener — pop it if so, fail if not. The stack must be empty at the end.",
    code: `function stackMatch(s, pairs) {
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
    scenario:
      "You get a string made only of brackets: ( ) [ ] { }. Say whether every opener is closed by the matching kind of closer, in the right order.",
    problemTable: [
      {
        level: "Easy",
        problem: "Valid Parentheses",
        slug: "valid-parentheses",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Remove All Adjacent Duplicates in String",
        tweak:
          "No pairs map. If the top of the stack equals the current character, pop it; otherwise push. Return the stack joined into a string.",
      },
      {
        level: "Easy",
        problem: "Baseball Game",
        tweak:
          "Stack of scores. A number is pushed, 'C' pops the last score, 'D' pushes double the top, '+' pushes the sum of the top two. Answer is the sum of the stack.",
      },
      {
        level: "Medium",
        problem: "Min Stack",
        tweak:
          "Keep a second stack (or store pairs) holding the minimum so far next to every pushed value, so getMin reads the top in O(1).",
      },
      {
        level: "Medium",
        problem: "Evaluate Reverse Polish Notation",
        tweak:
          "Push numbers. On an operator, pop two values, apply it (mind the order for - and /), and push the result back.",
      },
      {
        level: "Medium",
        problem: "Daily Temperatures",
        tweak:
          "Monotonic stack of indices. While today's temperature is higher than the one at the top, pop it and record the distance in days.",
      },
      {
        level: "Medium",
        problem: "Decode String",
        tweak:
          "Stack of (repeat count, text so far) pairs. On '[' push the pair and reset; on ']' pop it and append the current text repeated count times.",
      },
      {
        level: "Hard",
        problem: "Longest Valid Parentheses",
        tweak:
          "Stack of indices with -1 at the bottom. On ')' pop; if the stack is empty push the index as the new floor, otherwise the length is i - top.",
      },
      {
        level: "Hard",
        problem: "Largest Rectangle in Histogram",
        tweak:
          "Monotonic increasing stack of indices. When a shorter bar arrives, pop taller bars and compute their area using the new top as the left boundary.",
      },
    ],
    usedBy: [
      {
        slug: "valid-parentheses",
        title: "Valid Parentheses",
        tweak: "This is the base template. Closers are looked up in a pairs map (closer to opener); anything else is an opener and gets pushed. Fail if the popped opener is wrong, and also fail if the stack is not empty at the end.",
      },
    ],
  },
  {
    id: "linked-list-pointers",
    name: "Linked List Pointer Manipulation",
    description:
      "Two shapes to know cold: reversing a list by walking it once and flipping each pointer, and detecting a cycle with a slow pointer (1 step) and a fast pointer (2 steps).",
    code: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    scenario:
      "You get the first node of a singly linked list. Flip the list so every node points to the one before it, and return the new first node. A second shape on the same kind of list: say whether the list loops back on itself.",
    problemTable: [
      {
        level: "Easy",
        problem: "Reverse a Linked List",
        slug: "reverse-linked-list",
        tweak:
          "None. This is the base template (first code block).",
      },
      {
        level: "Easy",
        problem: "Middle of the Linked List",
        tweak:
          "Reuse the slow/fast pointers from the cycle shape. When fast reaches the end, slow is standing on the middle node.",
      },
      {
        level: "Easy",
        problem: "Merge Two Sorted Lists",
        tweak:
          "Use a dummy head and a tail pointer. At each step attach the smaller of the two current nodes and move that list forward.",
      },
      {
        level: "Medium",
        problem: "Detect a Cycle in a Linked List",
        slug: "detect-cycle",
        tweak:
          "None. This is the second code block, unchanged.",
      },
      {
        level: "Medium",
        problem: "Linked List Cycle II (Find Cycle Start)",
        tweak:
          "After slow and fast meet, reset one pointer to the head and move both one step at a time. Where they meet again is the cycle start.",
      },
      {
        level: "Medium",
        problem: "Remove Nth Node From End",
        tweak:
          "Use a dummy head. Start fast n steps ahead of slow, move both until fast is at the end, then skip slow.next.",
      },
      {
        level: "Medium",
        problem: "Reorder List",
        tweak:
          "Find the middle with slow/fast, reverse the second half with the reverse loop, then interleave the two halves.",
      },
      {
        level: "Hard",
        problem: "Reverse Nodes in k-Group",
        tweak:
          "Run the reverse loop for exactly k nodes at a time and reconnect each reversed group to the next. Leave a final group shorter than k untouched.",
      },
    ],
    usedBy: [
      {
        slug: "reverse-linked-list",
        title: "Reverse a Linked List",
        tweak: "This is the base template. Three pointers (prev, cur, next): save next, point cur backwards at prev, then step both forward. Return prev, not cur.",
      },
      {
        slug: "detect-cycle",
        title: "Detect a Cycle in a Linked List",
        tweak: "This is the base template. Slow moves 1 step, fast moves 2; if they ever land on the same node there is a loop, and if fast reaches the end there is none.",
      },
    ],
  },
  {
    id: "tree-dfs",
    name: "Tree DFS (Recursion with a Null Base Case)",
    description:
      "Every tree problem starts the same way: if the node is null, return a base case; otherwise recurse on left and right, then combine. What changes between problems is only the base case and the combine step — and sometimes the order you visit left vs. right.",
    code: `function maxDepth(node) {
  // BASE CASE: an empty spot has depth 0. Other problems change this value.
  if (!node) return 0;
  const left = maxDepth(node.left);   // answer for the whole left subtree
  const right = maxDepth(node.right); // answer for the whole right subtree
  // COMBINE: turn the two child answers plus this node into this node's answer.
  return 1 + Math.max(left, right);
}`,
    scenario:
      "You get the root of a binary tree. Return how many nodes are on the longest path from the root down to a leaf. An empty tree has depth 0.",
    problemTable: [
      {
        level: "Easy",
        problem: "Maximum Depth of a Binary Tree",
        slug: "max-depth-binary-tree",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Invert a Binary Tree",
        slug: "invert-binary-tree",
        tweak:
          "Change the combine line to build a new node with the children swapped: return [node.val, right, left]. The base case returns null instead of 0.",
      },
      {
        level: "Easy",
        problem: "Symmetric Tree",
        slug: "symmetric-tree",
        tweak:
          "Take two nodes instead of one. Recurse into the crossed pairs (a.left with b.right, a.right with b.left). Both null returns true, only one null returns false.",
      },
      {
        level: "Easy",
        problem: "Diameter of a Binary Tree",
        slug: "diameter-of-binary-tree",
        tweak:
          "Keep the height combine (1 + max(left, right)), but before returning check whether left + right beats a running best. The return value is still a height.",
      },
      {
        level: "Easy",
        problem: "Balanced Binary Tree",
        slug: "balanced-binary-tree",
        tweak:
          "Keep the height combine, but if left and right differ by more than 1 return -1, and any caller that receives -1 returns -1 straight up. Balanced means the final answer is not -1.",
      },
      {
        level: "Medium",
        problem: "Binary Tree Right Side View",
        slug: "right-side-view",
        tweak:
          "Pass the depth down, visit the RIGHT child before the left, and record a node's value only the first time its depth is reached.",
      },
      {
        level: "Medium",
        problem: "Validate Binary Search Tree",
        slug: "validate-bst",
        tweak:
          "Pass a (low, high) range down instead of returning a number up. Each child tightens one side of the range, and a node outside its range returns false.",
      },
      {
        level: "Medium",
        problem: "Lowest Common Ancestor of a Binary Tree",
        slug: "lowest-common-ancestor",
        tweak:
          "Return the node itself instead of a number. Return the node as soon as it equals p or q. If both sides return something, this node is the answer, otherwise pass up whichever side found one.",
      },
    ],
    usedBy: [
      {
        slug: "max-depth-binary-tree",
        title: "Maximum Depth of a Binary Tree",
        tweak:
          "This is the base template: base case = 0, combine = 1 + max(left, right).",
      },
      {
        slug: "right-side-view",
        title: "Binary Tree Right Side View",
        tweak:
          "Visit the RIGHT child before the left child (flip the usual order), and only record a node's value the first time its depth is reached — so the first node seen at each depth is always the rightmost one.",
      },
      {
        slug: "invert-binary-tree",
        title: "Invert a Binary Tree",
        tweak:
          "combine swaps left and right and returns a new node, instead of merging them into a number: return [val, dfs(right), dfs(left)].",
      },
      {
        slug: "validate-bst",
        title: "Validate Binary Search Tree",
        tweak:
          "Instead of returning a value upward, pass a shrinking (low, high) valid range downward through the recursion, tightened by the current node's value at each step.",
      },
      {
        slug: "diameter-of-binary-tree",
        title: "Diameter of a Binary Tree",
        tweak:
          "Same height-finding combine as max depth (1 + max(left, right)), but with a side-effect: before returning, check if left-height + right-height beats a running best-so-far, even though the return value itself is still just a height.",
      },
      {
        slug: "symmetric-tree",
        title: "Symmetric Tree",
        tweak:
          "Run the DFS on two nodes at once instead of one. Recurse into the crossed pairs (a.left with b.right, and a.right with b.left) instead of the same-side pairs; both-null is true, one-null is false.",
      },
      {
        slug: "lowest-common-ancestor",
        title: "Lowest Common Ancestor of a Binary Tree",
        tweak:
          "The DFS returns the node it found instead of a number. Return the node as soon as it equals p or q; if both the left and right calls return something, the current node is the answer, otherwise pass up whichever side found something.",
      },
      {
        slug: "balanced-binary-tree",
        title: "Balanced Binary Tree",
        tweak:
          "Same height-finding DFS as max depth, plus one check: if the two sides differ by more than 1, return -1, and any caller that receives -1 passes -1 straight up. The tree is balanced if the final answer is not -1.",
      },
    ],
  },
  {
    id: "bfs",
    name: "BFS (Queue, Ring by Ring)",
    description:
      "Keep a queue of 'nodes still to visit' and a visited set. Pull from the front, process it, push its unvisited neighbors to the back. Finishing one full ring before starting the next is what makes BFS find shortest paths.",
    code: `function bfsShortestPath(graph, start, target) {
  const visited = new Set([start]); // mark nodes when they are QUEUED, so none is queued twice
  const queue = [start];
  let head = 0;                     // read position, avoids the slow queue.shift()
  let dist = 0;                     // number of rings finished so far
  while (head < queue.length) {
    const ringSize = queue.length - head; // everything queued right now is one ring
    for (let i = 0; i < ringSize; i++) {
      const node = queue[head++];
      if (node === target) return dist;   // process node here
      for (const next of graph[node] || []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    dist++; // one full ring done, so the next ring is one edge farther away
  }
  return -1; // the target was never reached
}`,
    scenario:
      "You get an unweighted graph as an adjacency list, a start node and a target node. Return the fewest edges on any path from start to target, or -1 if the target cannot be reached.",
    problemTable: [
      {
        level: "Easy",
        problem: "Minimum Depth of a Binary Tree",
        tweak:
          "Start from the root and use node.left and node.right as the neighbors (no visited set needed). Return dist at the first node with no children.",
      },
      {
        level: "Medium",
        problem: "Shortest Path in an Unweighted Graph",
        slug: "shortest-path-bfs",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Medium",
        problem: "Level Order Traversal",
        slug: "level-order-traversal",
        tweak:
          "Keep the ring loop, but collect each ring's values into its own list and push that list to the result after the ring finishes. No target and no dist.",
      },
      {
        level: "Medium",
        problem: "Rotten Oranges",
        slug: "rotten-oranges",
        tweak:
          "Multi-source: put EVERY rotten orange in the queue before the loop starts. Neighbors are the 4 grid cells that hold a fresh orange. Each ring is one minute.",
      },
      {
        level: "Medium",
        problem: "01 Matrix",
        tweak:
          "Multi-source: queue every 0 cell first. Write each ring's dist into the answer grid for the 1 cells it reaches, instead of returning early.",
      },
      {
        level: "Medium",
        problem: "Course Schedule",
        slug: "course-schedule",
        tweak:
          "This is Kahn's algorithm. Seed the queue with every node that has zero prerequisites, and instead of a visited set decrement each neighbor's counter, queueing it when the counter hits 0.",
      },
      {
        level: "Hard",
        problem: "Word Ladder",
        slug: "word-ladder",
        tweak:
          "Neighbors are generated on the fly: try changing each letter of the word and keep results that are in the word list. Return dist + 1 when the target word is reached.",
      },
    ],
    usedBy: [
      {
        slug: "shortest-path-bfs",
        title: "Shortest Path in an Unweighted Graph",
        tweak:
          "This is the base template. The ring count (dist) is the distance, so return it when the target is dequeued.",
      },
      {
        slug: "level-order-traversal",
        title: "Level Order Traversal",
        tweak:
          "Keep the ring-by-ring loop, but collect each ring's values into their own list and push that list to the result before moving on to the next ring.",
      },
      {
        slug: "course-schedule",
        title: "Course Schedule",
        tweak:
          "This is Kahn's algorithm: the queue starts seeded with every node that has zero prerequisites (instead of one single start node), and 'visiting' a node decrements its neighbors' prerequisite counters — a neighbor joins the queue once its counter hits zero.",
      },
      {
        slug: "word-ladder",
        title: "Word Ladder",
        tweak:
          "Neighbors aren't stored anywhere — they're generated on the fly by trying every single-letter change to the current word and keeping the ones that are in the allowed word list.",
      },
      {
        slug: "rotten-oranges",
        title: "Rotten Oranges",
        tweak:
          "Multi-source BFS: seed the queue with EVERY starting rotten orange at once, not just one node. Each full ring processed = one minute passed.",
      },
    ],
  },
  {
    id: "dfs-flood-fill",
    name: "DFS Flood Fill",
    description:
      "From an unvisited starting cell, recurse into every connected neighbor, marking each as visited so it's never processed twice. Count how many times a fresh fill had to start.",
    code: `function countRegions(grid, isTarget, visit) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (isTarget(grid[r][c])) { // an unvisited target cell starts a brand new region
        count++;
        floodFill(grid, r, c, isTarget, visit);
      }
    }
  }
  return count;
}

function floodFill(grid, r, c, isTarget, visit) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return; // off the grid
  if (!isTarget(grid[r][c])) return; // water, or a cell the fill already visited
  visit(grid, r, c);                 // mark it (for islands: set '1' to '0') so it is never counted twice
  floodFill(grid, r + 1, c, isTarget, visit);
  floodFill(grid, r - 1, c, isTarget, visit);
  floodFill(grid, r, c + 1, isTarget, visit);
  floodFill(grid, r, c - 1, isTarget, visit);
}`,
    scenario:
      "You get a grid of '1' (land) and '0' (water). Count the islands, where an island is a group of land cells joined up, down, left or right.",
    problemTable: [
      {
        level: "Easy",
        problem: "Flood Fill",
        tweak:
          "No counting loop. Call floodFill once from the given cell, with isTarget = the cell has the starting color and visit = paint it the new color. Return early if the new color equals the old one.",
      },
      {
        level: "Medium",
        problem: "Number of Islands",
        slug: "number-of-islands",
        tweak:
          "None. This is the base template: isTarget = cell === '1', visit sets the cell to '0'.",
      },
      {
        level: "Medium",
        problem: "Max Area of Island",
        tweak:
          "Make floodFill return the number of cells it covered (1 plus the four neighbor calls) and keep the biggest result from the counting loop.",
      },
      {
        level: "Medium",
        problem: "Number of Provinces",
        slug: "number-of-provinces",
        tweak:
          "Not a grid. A neighbor of city i is any city j where matrix[i][j] === 1, and a visited array replaces the grid marking.",
      },
      {
        level: "Medium",
        problem: "Graph Valid Tree",
        slug: "graph-valid-tree",
        tweak:
          "Not a grid. Build an adjacency list from the edges. Reject if edges is not n - 1, then run one fill from node 0 and check that it visited all n nodes.",
      },
      {
        level: "Medium",
        problem: "Surrounded Regions",
        slug: "surrounded-regions",
        tweak:
          "Start the fill only from the border cells that are 'O', marking what it reaches with a temporary 'S'. Then flip every remaining 'O' to 'X' and every 'S' back to 'O'.",
      },
      {
        level: "Medium",
        problem: "Pacific Atlantic Water Flow",
        slug: "pacific-atlantic",
        tweak:
          "Run the fill twice, from the top and left edges and from the bottom and right edges, each with its own visited grid. Move to a neighbor only if it is the same height or higher. Answer cells are visited in both.",
      },
      {
        level: "Hard",
        problem: "Making A Large Island",
        tweak:
          "First fill every island and label it with an id, saving each size. Then for every water cell add the sizes of the distinct ids around it, plus 1, and keep the best.",
      },
    ],
    usedBy: [
      {
        slug: "number-of-islands",
        title: "Number of Islands",
        tweak:
          "This is the base template. The loop starts a fill from every unvisited land cell, and the number of fills started is the answer.",
      },
      {
        slug: "number-of-provinces",
        title: "Number of Provinces",
        tweak:
          "'Neighbor' no longer means up/down/left/right on a grid — it means any city j where the adjacency matrix says city i and city j are connected (matrix[i][j] === 1).",
      },
      {
        slug: "graph-valid-tree",
        title: "Graph Valid Tree",
        tweak:
          "Not a grid: neighbors come from an adjacency list built from the edges. First reject if edges is not n-1, then run one fill from node 0 and check that it visited all n nodes. The edge count rules out cycles.",
      },
      {
        slug: "surrounded-regions",
        title: "Surrounded Regions",
        tweak:
          "Start the fill only from the border cells that are O, not from every cell, marking what it reaches with a temporary S. Then one last pass flips every remaining O to X and every S back to O.",
      },
      {
        slug: "pacific-atlantic",
        title: "Pacific Atlantic Water Flow",
        tweak:
          "Run the fill twice, once from the top and left edges and once from the bottom and right edges, each with its own visited grid. A neighbor is allowed only if it is the same height or higher (water flows downhill, so we walk uphill). Answer cells are visited in both grids.",
      },
    ],
  },
  {
    id: "lru-design",
    name: "Hash Map + Ordered Structure (LRU)",
    description:
      "Combine a hash map (instant lookup) with a structure that tracks order (instant 'move to most-recent' and 'evict least-recent'). The map points straight at a node in the ordered structure.",
    code: `// Conceptually: map<key, Node> + a doubly linked list.
// On get(key):  move that key's node to the front of the list.
// On put(key):  if present, update + move to front;
//               if full, evict the node at the BACK of the list first.
// Whatever sits at the back of the list is always the least recently used.`,
    scenario:
      "Build a cache that holds at most N items. get(key) returns the value or -1, and put(key, value) stores it. When the cache is full, the least recently used item is removed first. Both operations must run in O(1).",
    problemTable: [
      {
        level: "Hard",
        problem: "LRU Cache",
        slug: "lru-cache",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Easy",
        problem: "Logger Rate Limiter",
        tweak:
          "Only the map is needed, no ordering. Store the last time each message was printed and allow it again when now - last >= 10.",
      },
      {
        level: "Medium",
        problem: "Insert Delete GetRandom O(1)",
        tweak:
          "Pair the map (value to index) with an array. To delete, swap the value with the last array element, pop, and fix the moved element's index.",
      },
      {
        level: "Medium",
        problem: "Time Based Key-Value Store",
        tweak:
          "The map's value becomes a list of (time, value) pairs. get(key, t) binary searches that list for the latest time <= t.",
      },
      {
        level: "Hard",
        problem: "LFU Cache",
        tweak:
          "Add a second map from frequency to an ordered list, and track minFreq. On eviction remove the oldest node in the minFreq list.",
      },
    ],
    usedBy: [
      {
        slug: "lru-cache",
        title: "LRU Cache",
        tweak:
          "Direct template. (The JS/Python solutions use a Map/OrderedDict, which already tracks insertion order and lets you re-insert a key to bump it to the end — same idea without hand-rolling the linked list. The Go solution hand-rolls it with container/list to show the real shape.)",
      },
    ],
  },
  {
    id: "heap-topk",
    name: "Heap / Top-K",
    description:
      "Keep a small pile of exactly k items, ordered so the weakest one is always easy to find and evict. Anything better than the current weakest pile member kicks it out. Whatever survives is the top-k.",
    code: `function keepTopK(nums, k) {
  const heap = []; // min-heap of size k: the root is always the WEAKEST of the k best
  for (const num of nums) {
    if (heap.length < k) {
      heapPush(heap, num);          // still filling the pile
    } else if (num > heap[0]) {
      heapReplaceRoot(heap, num);   // beats the weakest, so it takes its place
    }
  }
  return heap; // the k largest items; heap[0] is the kth largest
}`,
    scenario:
      "You get an array of numbers and a number k. Return the kth largest number in the array (the kth in sorted order from the top, counting duplicates).",
    problemTable: [
      {
        level: "Easy",
        problem: "Kth Largest Element in a Stream",
        tweak:
          "Keep the heap alive between calls. add(val) pushes val, pops the root if the size goes above k, and returns heap[0].",
      },
      {
        level: "Easy",
        problem: "Last Stone Weight",
        tweak:
          "Flip to a max-heap holding all stones. Pop the two largest, push their difference if it is above 0, and repeat until at most one stone is left.",
      },
      {
        level: "Medium",
        problem: "Kth Largest Element in an Array",
        slug: "kth-largest-element",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Medium",
        problem: "Top K Frequent Elements",
        slug: "top-k-frequent",
        tweak:
          "Count frequencies first, then rank by count instead of value. A heap of size k works, or bucket sort: put each number in the bucket at index = its frequency and read from the highest bucket down.",
      },
      {
        level: "Medium",
        problem: "K Closest Points to Origin",
        tweak:
          "Rank by distance instead of value and keep the k SMALLEST, so use a max-heap of size k and evict the root when a point is closer than it.",
      },
      {
        level: "Hard",
        problem: "Find Median from Data Stream",
        tweak:
          "Use two heaps: a max-heap for the lower half and a min-heap for the upper half. Keep their sizes within 1 of each other, and the median comes from the roots.",
      },
      {
        level: "Hard",
        problem: "Merge k Sorted Lists",
        tweak:
          "Seed the heap with the head of every list. Pop the smallest, append it to the result, and push that node's next. The heap never holds more than k nodes.",
      },
    ],
    usedBy: [
      {
        slug: "kth-largest-element",
        title: "Kth Largest Element in an Array",
        tweak:
          "Direct template — a min-heap of size k, and the answer is whatever is left at the root (heap[0]) once every number has been considered.",
      },
      {
        slug: "top-k-frequent",
        title: "Top K Frequent Elements",
        tweak:
          "Same 'keep the best k' goal, but swaps the heap for bucket sort: since frequency is bounded by the array length, you can drop each number straight into a bucket indexed by its frequency and read the top buckets first — avoiding the O(log k) heap overhead entirely.",
      },
    ],
  },
  {
    id: "union-find",
    name: "Union-Find (Disjoint Set)",
    description:
      "Every node points to a parent; the node at the top of a chain is its group's leader. find() walks up to the leader, union() joins two groups by pointing one leader at the other. If find says two nodes already share a leader, connecting them would make a cycle.",
    code: `function unionFind(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // shorten the chain as we climb
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false; // already in the same group: this edge makes a cycle
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  }
  let groups = n;
  for (const [a, b] of edges) if (union(a, b)) groups--;
  return groups;
}`,
    scenario:
      "You get n nodes numbered 0 to n - 1 and a list of undirected edges. Return how many separate groups of connected nodes there are.",
    problemTable: [
      {
        level: "Easy",
        problem: "Find if Path Exists in Graph",
        tweak:
          "Union every edge, then return find(source) === find(destination). No group counter is needed.",
      },
      {
        level: "Medium",
        problem: "Number of Connected Components in an Undirected Graph",
        tweak:
          "None. This is the base template: return groups after all the unions.",
      },
      {
        level: "Medium",
        problem: "Number of Provinces",
        slug: "number-of-provinces",
        tweak:
          "Build the edges from the matrix: for every i and j where isConnected[i][j] is 1, call union(i, j). The answer is the final groups count.",
      },
      {
        level: "Medium",
        problem: "Graph Valid Tree",
        slug: "graph-valid-tree",
        tweak:
          "If union() returns false for any edge, that edge closes a cycle, so return false. At the end the graph is a tree only if groups is exactly 1.",
      },
      {
        level: "Medium",
        problem: "Redundant Connection",
        tweak:
          "Go through the edges in order and return the first edge where union() returns false, because it closes the cycle.",
      },
      {
        level: "Medium",
        problem: "Satisfiability of Equality Equations",
        tweak:
          "Map letters to 0..25. First union every 'a==b' equation, then check every 'a!=b' equation and return false if find(a) === find(b).",
      },
      {
        level: "Medium",
        problem: "Accounts Merge",
        tweak:
          "Nodes are account indexes. Keep a map from email to the first account that owned it, and union the current account with that owner. Then group emails by find(account).",
      },
      {
        level: "Hard",
        problem: "Number of Islands II",
        tweak:
          "Add land one cell at a time. Each new land cell starts as its own group (groups++), then union it with each land neighbor and decrement groups for every successful union. Record groups after each add.",
      },
    ],
    usedBy: [
      {
        slug: "number-of-provinces",
        title: "Number of Provinces",
        tweak:
          "Alternative to the DFS version. Instead of edges, loop over the matrix cells where isConnected[i][j] is 1 and union(i, j). The answer is the final groups count.",
      },
      {
        slug: "graph-valid-tree",
        title: "Graph Valid Tree",
        tweak:
          "Alternative to the DFS version. If union() returns false for any edge, that edge closes a cycle, so return false. At the end the graph is a tree only if groups is exactly 1.",
      },
    ],
  },
  {
    id: "topological-sort",
    name: "Topological Sort (Kahn's Algorithm)",
    description:
      "Count how many things each node is waiting on (its indegree). Start with the nodes waiting on nothing, and every time you finish one, lower the count of everything that depended on it. If you cannot finish every node, there is a cycle.",
    code: `function topoSort(n, prereqs) {
  // prereqs: [node, mustComeBefore]
  const adj = Array.from({ length: n }, () => []);
  const indegree = Array(n).fill(0);
  for (const [node, before] of prereqs) {
    adj[before].push(node);
    indegree[node]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const cur = queue.shift();
    order.push(cur);
    for (const next of adj[cur]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }
  return order.length === n ? order : []; // short order means a cycle
}`,
    scenario:
      "You get n courses numbered 0 to n - 1 and a list of pairs [course, prerequisite]. Return an order in which you can finish all the courses, or an empty list if the prerequisites form a cycle.",
    problemTable: [
      {
        level: "Easy",
        problem: "Find the Town Judge",
        tweak:
          "No queue. Use the indegree idea as plain counters: the judge is the one person trusted by n - 1 people (indegree n - 1) who trusts nobody (outdegree 0).",
      },
      {
        level: "Medium",
        problem: "Course Schedule",
        slug: "course-schedule",
        tweak:
          "Return order.length === n (can every course be finished?) instead of the order itself.",
      },
      {
        level: "Medium",
        problem: "Course Schedule II",
        tweak:
          "None. This is the base template.",
      },
      {
        level: "Medium",
        problem: "Parallel Courses",
        tweak:
          "Process the queue one ring at a time and count the rings. The ring count is the number of semesters. Return -1 if the order is shorter than n.",
      },
      {
        level: "Medium",
        problem: "Minimum Height Trees",
        tweak:
          "Peel from the outside. Use the same queue, but seed it with nodes of degree 1 on an undirected graph, remove them ring by ring, and return the nodes left when 2 or fewer remain.",
      },
      {
        level: "Hard",
        problem: "Alien Dictionary",
        tweak:
          "Build the graph yourself: compare each pair of neighboring words, and the first different letters give one edge (a before b). Run Kahn's on the letters. Return an empty string if there is a cycle.",
      },
    ],
    usedBy: [
      {
        slug: "course-schedule",
        title: "Course Schedule",
        tweak:
          "Alternative to the DFS cycle check. Return order.length === n (can every course be finished?) instead of returning the order itself.",
      },
    ],
  },
];

// "Twist drills": the same base pattern with one small change, which is the
// kind of variation an interviewer is likely to ask for. Each line says what to
// change in the template you already memorized.
export interface TwistDrill {
  base: string; // the problem you already know
  twist: string; // the variation you might be asked
  change: string; // exactly what to change
  patternId: string;
}

export const TWIST_DRILLS: TwistDrill[] = [
  {
    base: "Right Side View",
    twist: "Left Side View",
    change: "Visit the left child before the right child. Nothing else changes.",
    patternId: "tree-dfs",
  },
  {
    base: "Right Side View",
    twist: "Right Side View using BFS",
    change: "Switch to the level-order BFS and keep only the last value of each ring.",
    patternId: "bfs",
  },
  {
    base: "Level Order Traversal",
    twist: "Zigzag Level Order",
    change: "Same ring-by-ring BFS; reverse the list of values on every second ring.",
    patternId: "bfs",
  },
  {
    base: "Maximum Depth of a Binary Tree",
    twist: "Minimum Depth",
    change: "Same height DFS, but a node with only one child is not a leaf: only take the min over sides that exist, otherwise you return 1 too early.",
    patternId: "tree-dfs",
  },
  {
    base: "Symmetric Tree",
    twist: "Same Tree / Subtree Check",
    change: "Pair the SAME sides (a.left with b.left, a.right with b.right) instead of crossing them. Subtree check runs this at every node.",
    patternId: "tree-dfs",
  },
  {
    base: "Invert a Binary Tree",
    twist: "Check if two trees are mirrors",
    change: "Keep the invert idea, but compare instead of building: that is the Symmetric Tree pairing.",
    patternId: "tree-dfs",
  },
  {
    base: "Lowest Common Ancestor of a Binary Tree",
    twist: "Lowest Common Ancestor of a BST",
    change: "Use the ordering: if both values are smaller than the node go left, if both are larger go right, otherwise the current node is the answer. No search of both sides needed.",
    patternId: "tree-dfs",
  },
  {
    base: "Validate Binary Search Tree",
    twist: "Kth Smallest Element in a BST",
    change: "Walk left, node, right (in-order), which visits values in sorted order, and stop on the kth visit.",
    patternId: "tree-dfs",
  },
  {
    base: "Shortest Path in an Unweighted Graph",
    twist: "Shortest path from several starts (Rotten Oranges style)",
    change: "Put every starting node in the queue before the loop begins, all at distance 0.",
    patternId: "bfs",
  },
  {
    base: "Number of Islands",
    twist: "Max Area of Island",
    change: "Make the fill return the number of cells it covered (1 plus the four neighbor calls) and keep the biggest.",
    patternId: "dfs-flood-fill",
  },
  {
    base: "Number of Islands",
    twist: "Surrounded Regions / Pacific Atlantic",
    change: "Stop starting fills from every cell. Start them only from the border cells (and for Pacific Atlantic, walk uphill from the ocean edges).",
    patternId: "dfs-flood-fill",
  },
  {
    base: "Number of Provinces",
    twist: "Number of Connected Components from an edge list",
    change: "Same count of groups; build neighbors from the edge list, or use Union-Find and subtract one for every successful union.",
    patternId: "union-find",
  },
  {
    base: "Course Schedule",
    twist: "Course Schedule II (return the order)",
    change: "Return the order array from Kahn's algorithm instead of just checking its length. Return an empty list if it is shorter than n.",
    patternId: "topological-sort",
  },
  {
    base: "Maximum Number of Lectures in One Hall",
    twist: "Merge Overlapping Intervals",
    change: "Sort by START instead of end, and stretch the last kept interval's end rather than counting picks.",
    patternId: "greedy-intervals",
  },
  {
    base: "Kth Largest Element in an Array",
    twist: "Kth Smallest Element in an Array",
    change: "Flip the heap: keep a MAX-heap of size k, and the answer is its root.",
    patternId: "heap-topk",
  },
  {
    base: "Classic Binary Search",
    twist: "Upper Bound / First Bad Version",
    change: "Switch to the left < right form: on a hit, set right = mid instead of returning. The comparison becomes arr[mid] > target for upper bound, or isBad(mid) for First Bad Version.",
    patternId: "binary-search",
  },
  {
    base: "Longest Substring Without Repeating Characters",
    twist: "Longest substring with at most k distinct characters",
    change: "Keep a count per character in the window and move the left edge forward while the number of distinct characters is above k.",
    patternId: "sliding-window",
  },
];

export function getPattern(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
