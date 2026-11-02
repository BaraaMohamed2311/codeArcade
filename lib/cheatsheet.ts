<<<<<<< HEAD
// Pattern cheat sheet: memorize these ~14 shapes and you can derive most of
=======
// Pattern cheat sheet: memorize these shapes and you can derive most of
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
        tweak: "This is the base template, unchanged.",
=======
        tweak: "This is the base template. The one line to memorize is left = lastSeen[ch] + 1: when the new character repeats inside the window, jump the left edge just past its previous position.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
        tweak: "This is the base template, unchanged.",
=======
        tweak: "This is the base template. The one line to memorize is the move rule: always move the pointer at the SHORTER wall inward, because the shorter wall is what limits the area.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
        tweak: "This is the base template directly — check(mid) = arr[mid] >= target.",
=======
        tweak: "This is the base template. The only line that changes between binary-search problems is the check: here check(mid) is arr[mid] >= target, and the answer is the first spot where it becomes true.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
          "This is the base template directly — every partial path gets recorded immediately, since every subset (not just the full ones) is a valid answer.",
=======
          "This is the base template. Record a copy of the current path at the very start of every call (every partial path is a valid subset), then loop over the remaining choices: choose, recurse, undo.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
        tweak: "This is the base template directly.",
=======
        tweak: "This is the base template. Sort by END time, then take a lecture whenever its start is at or after the end of the last one you took.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
        tweak: "This is the base template, unchanged.",
=======
        tweak: "This is the base template. Closers are looked up in a pairs map (closer to opener); anything else is an opener and gets pushed. Fail if the popped opener is wrong, and also fail if the stack is not empty at the end.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
        tweak: "This is the base reverseList template directly.",
=======
        tweak: "This is the base template. Three pointers (prev, cur, next): save next, point cur backwards at prev, then step both forward. Return prev, not cur.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
      },
      {
        slug: "detect-cycle",
        title: "Detect a Cycle in a Linked List",
<<<<<<< HEAD
        tweak: "This is the base hasCycle template directly (fast and slow pointers).",
=======
        tweak: "This is the base template. Slow moves 1 step, fast moves 2; if they ever land on the same node there is a loop, and if fast reaches the end there is none.",
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
=======
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
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
=======
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
>>>>>>> 654a063 (cheatsheets and aws roadmap)
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
<<<<<<< HEAD
=======
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
    base: "Lower Bound (First Index >= Target)",
    twist: "Upper Bound / First Bad Version",
    change: "Only the check changes: arr[mid] > target for upper bound, or isBad(mid) for First Bad Version. The halving loop stays the same.",
    patternId: "binary-search",
  },
  {
    base: "Longest Substring Without Repeating Characters",
    twist: "Longest substring with at most k distinct characters",
    change: "Keep a count per character in the window and move the left edge forward while the number of distinct characters is above k.",
    patternId: "sliding-window",
  },
>>>>>>> 654a063 (cheatsheets and aws roadmap)
];

export function getPattern(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
