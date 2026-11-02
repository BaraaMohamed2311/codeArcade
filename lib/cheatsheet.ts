// Pattern cheat sheet: memorize these ~14 shapes and you can derive most of
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

export interface Pattern {
  id: string;
  name: string;
  description: string;
  code: string;
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
    usedBy: [
      {
        slug: "longest-substring",
        title: "Longest Substring Without Repeating Characters",
        tweak: "This is the base template, unchanged.",
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
    usedBy: [
      {
        slug: "container-with-most-water",
        title: "Container With Most Water",
        tweak: "This is the base template, unchanged.",
      },
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search (Boundary Template)",
    description:
      "Halve the search range every step. The 'check' function decides which half to keep. Works for exact matches, first-true boundaries, and rotated arrays with one extra decision up front.",
    code: `function binarySearch(lo, hi, check) {
  // returns the first index where check(index) is true
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (check(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    usedBy: [
      {
        slug: "lower-bound",
        title: "Lower Bound (First Index >= Target)",
        tweak: "This is the base template directly — check(mid) = arr[mid] >= target.",
      },
      {
        slug: "binary-search",
        title: "Classic Binary Search",
        tweak:
          "Same halving idea, but since it needs an exact index (not a boundary), it compares arr[mid] to the target directly and returns immediately on a match instead of shrinking toward a boundary.",
      },
      {
        slug: "search-rotated",
        title: "Search in Rotated Sorted Array",
        tweak:
          "Before comparing to the target, first work out which half (left or right of mid) is still in sorted order, then only trust the boundary check within that sorted half.",
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
    usedBy: [
      {
        slug: "subsets",
        title: "Subsets (Power Set)",
        tweak:
          "This is the base template directly — every partial path gets recorded immediately, since every subset (not just the full ones) is a valid answer.",
      },
    ],
  },
  {
    id: "dp-1d",
    name: "1D Dynamic Programming",
    description:
      "Build the answer for every size from the smallest up to the target, reusing answers you already solved instead of recomputing them.",
    code: `function dp1d(n, transition) {
  const table = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    table[i] = transition(table, i);
  }
  return table[n];
}`,
    usedBy: [
      {
        slug: "coin-change",
        title: "Coin Change",
        tweak:
          "The table tracks the minimum coins for each amount (start at infinity, not 0), and the transition tries every coin and keeps the smallest result.",
      },
      {
        slug: "house-robber",
        title: "House Robber",
        tweak:
          "Only the last two table values are ever needed at once (each step only looks back two houses), so the full array collapses into two rolling variables.",
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
    usedBy: [
      {
        slug: "max-lectures",
        title: "Maximum Number of Lectures in One Hall",
        tweak: "This is the base template directly.",
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
    usedBy: [
      {
        slug: "valid-parentheses",
        title: "Valid Parentheses",
        tweak: "This is the base template, unchanged.",
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
    usedBy: [
      {
        slug: "reverse-linked-list",
        title: "Reverse a Linked List",
        tweak: "This is the base reverseList template directly.",
      },
      {
        slug: "detect-cycle",
        title: "Detect a Cycle in a Linked List",
        tweak: "This is the base hasCycle template directly (fast and slow pointers).",
      },
    ],
  },
  {
    id: "tree-dfs",
    name: "Tree DFS (Recursion with a Null Base Case)",
    description:
      "Every tree problem starts the same way: if the node is null, return a base case; otherwise recurse on left and right, then combine. What changes between problems is only the base case and the combine step — and sometimes the order you visit left vs. right.",
    code: `function dfs(node) {
  if (!node) return BASE_CASE;
  const left = dfs(node.left);
  const right = dfs(node.right);
  return combine(node.val, left, right);
}`,
    usedBy: [
      {
        slug: "max-depth-binary-tree",
        title: "Maximum Depth of a Binary Tree",
        tweak: "combine = 1 + max(left, right). Base case = 0.",
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
    ],
  },
  {
    id: "bfs",
    name: "BFS (Queue, Ring by Ring)",
    description:
      "Keep a queue of 'nodes still to visit' and a visited set. Pull from the front, process it, push its unvisited neighbors to the back. Finishing one full ring before starting the next is what makes BFS find shortest paths.",
    code: `function bfs(start, getNeighbors) {
  const visited = new Set([start]);
  const queue = [start];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    // process node here
    for (const next of getNeighbors(node)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
}`,
    usedBy: [
      {
        slug: "shortest-path-bfs",
        title: "Shortest Path in an Unweighted Graph",
        tweak:
          "Carry a distance alongside each queued node (or track it per ring) and return as soon as the target is dequeued — the ring count IS the distance.",
      },
      {
        slug: "level-order-traversal",
        title: "Level Order Traversal",
        tweak:
          "Instead of a flat queue, process one whole ring (level) at a time explicitly, collecting all of that ring's values together before moving to the next ring.",
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
    code: `function floodFill(grid, r, c, isTarget, visit) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
  if (!isTarget(grid[r][c])) return;
  visit(grid, r, c);
  floodFill(grid, r + 1, c, isTarget, visit);
  floodFill(grid, r - 1, c, isTarget, visit);
  floodFill(grid, r, c + 1, isTarget, visit);
  floodFill(grid, r, c - 1, isTarget, visit);
}`,
    usedBy: [
      {
        slug: "number-of-islands",
        title: "Number of Islands",
        tweak:
          "Call floodFill from every unvisited land cell found while scanning the grid; count how many times a new fill had to start.",
      },
      {
        slug: "number-of-provinces",
        title: "Number of Provinces",
        tweak:
          "'Neighbor' no longer means up/down/left/right on a grid — it means any city j where the adjacency matrix says city i and city j are connected (matrix[i][j] === 1).",
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
  const heap = []; // min-heap of size k
  for (const num of nums) {
    if (heap.length < k) {
      heapPush(heap, num);
    } else if (num > heap[0]) {
      heapReplaceRoot(heap, num);
    }
  }
  return heap; // the k largest items; heap[0] is the kth largest
}`,
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
];

export function getPattern(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
