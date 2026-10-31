export const courseNotesData = {
  nodejs: {
    id: "nodejs",
    title: "Node.js Full Course - Backend Masterclass",
    videos: [
      {
        id: "node-v1",
        title: "Lecture 1: Node.js Architecture, V8 Engine & Event Loop Deep Dive",
        duration: "52 mins",
        instructor: "Senior Backend Architect",
        embedId: "Oe421EPjeBE",
        summary: "Detailed breakdown of the V8 engine, libuv, thread pool, and non-blocking asynchronous I/O model.",
      },
      {
        id: "node-v2",
        title: "Lecture 2: Express.js Architecture, REST APIs & Custom Middleware",
        duration: "1 hr 15 mins",
        instructor: "Staff Software Engineer",
        embedId: "7nafaH9SddU",
        summary: "Production-ready routing, error-handling middleware, request validation, and environment configurations.",
      },
      {
        id: "node-v3",
        title: "Lecture 3: Database Integration, MongoDB & Mongoose Schema Design",
        duration: "48 mins",
        instructor: "Database Specialist",
        embedId: "DZBGEExL2KU",
        summary: "Schema indexing, aggregation pipelines, embedding vs referencing, and connection pooling.",
      },
      {
        id: "node-v4",
        title: "Lecture 4: JWT Authentication, Refresh Tokens & Production Security",
        duration: "58 mins",
        instructor: "Security & Cloud Architect",
        embedId: "mbsmsi7l3r4",
        summary: "HttpOnly cookies, JWT signing, password hashing with bcrypt, CSRF protection, and rate limiting.",
      },
    ],
    modules: [
      {
        title: "Module 1: Node.js Architecture & Event Loop",
        summary: "Understanding V8, libuv, Single-threaded non-blocking I/O model.",
        content: `### 1. How Node.js Works Internally
Node.js is a runtime built on Chrome's V8 JavaScript engine. It executes JavaScript using an event-driven, non-blocking I/O model.

- **V8 Engine:** Compiles JavaScript code into native machine code.
- **libuv:** A C library that provides the event loop and thread pool (default 4 threads) for asynchronous operations (filesystem, DNS, crypto).

### 2. The 6 Phases of the Event Loop
1. **Timers:** Executes callbacks scheduled by setTimeout() and setInterval().
2. **Pending Callbacks:** Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare:** Internal use only.
4. **Poll:** Retrieves new I/O events; executes I/O related callbacks.
5. **Check:** Executes callbacks from setImmediate().
6. **Close Callbacks:** Executes close events (e.g. socket.on('close')).

\`\`\`javascript
// Priority order demonstration
setTimeout(() => console.log("Timer 1"), 0);
setImmediate(() => console.log("Immediate 1"));
process.nextTick(() => console.log("Next Tick 1")); // Runs before loop proceeds!
Promise.resolve().then(() => console.log("Promise Microtask 1"));
\`\`\``,
      },
      {
        title: "Module 2: Express.js Architecture & Middleware",
        summary: "Routing, custom middleware, error handling pipelines.",
        content: `### 1. Middleware Concept
In Express, middleware functions have access to the request object (\`req\`), response object (\`res\`), and the \`next()\` function.

\`\`\`javascript
// Global Logging & Auth Middleware Example
const express = require('express');
const app = express();

app.use(express.json());

// Custom Request Logger
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
\`\`\``,
      },
      {
        title: "Module 3: Database & Mongoose (MongoDB)",
        summary: "Schema design, indexing, relationships, and aggregation pipelines.",
        content: `### 1. Schema Design Best Practices
- Use embedded documents for 1-to-few relationships.
- Use referenced documents with \`ObjectId\` for 1-to-many or many-to-many relationships.
- Always create indexes on fields queried frequently (e.g. \`email\`, \`username\`).

\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Compound index example for fast searching
userSchema.index({ email: 1, role: 1 });
\`\`\``,
      },
      {
        title: "Module 4: JWT Authentication & Security",
        summary: "Token generation, bcrypt hashing, cookies, and CORS security.",
        content: `### Security Checklist for Production
1. Hash passwords using \`bcrypt\` with at least 10 salt rounds.
2. Sign JWT tokens with short expiry (e.g. 15m) and use Refresh Tokens stored in \`httpOnly\` cookies.
3. Use \`helmet\` to set secure HTTP headers.
4. Implement rate limiting using \`express-rate-limit\` to prevent brute-force attacks.

\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sign Token
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: '1h'
});
\`\`\``,
      },
    ],
    interviewQA: [
      {
        q: "What is the difference between process.nextTick() and setImmediate()?",
        a: "process.nextTick() executes immediately after the current operation completes, before the event loop continues to the next phase. setImmediate() executes in the Check phase of the event loop.",
      },
      {
        q: "How does Node.js handle concurrency if it is single-threaded?",
        a: "Node.js utilizes libuv's event-driven asynchronous I/O and an underlying C++ thread pool. Network and file operations are offloaded to OS kernel threads or the libuv worker pool.",
      },
      {
        q: "What causes memory leaks in Node.js applications?",
        a: "Common causes include global variables, unclosed event listeners or streams, forgotten timers (setInterval), and holding large closures in memory.",
      },
    ],
  },

  react: {
    id: "react",
    title: "React.js Masterclass - Frontend Strategy",
    videos: [
      {
        id: "react-v1",
        title: "Lecture 1: React.js Architecture, Virtual DOM & Fiber Reconciler",
        duration: "1 hr 12 mins",
        instructor: "Principal Frontend Architect",
        embedId: "bMknfKXIFA8",
        summary: "Understanding reconciliation, diffing algorithm, fiber tree, concurrent rendering, and batching.",
      },
      {
        id: "react-v2",
        title: "Lecture 2: Advanced React Hooks Deep Dive (useMemo, useCallback, useRef)",
        duration: "55 mins",
        instructor: "Senior React Engineer",
        embedId: "TNhaISOUy6Q",
        summary: "Performance optimization, memoization patterns, referential equality, and custom hooks.",
      },
      {
        id: "react-v3",
        title: "Lecture 3: Global State Architecture - Redux Toolkit & Context API",
        duration: "1 hr 08 mins",
        instructor: "UI Architecture Lead",
        embedId: "9boMnm5X9ak",
        summary: "Creating slices, async thunks, selector caching, and architectural tradeoffs between Context and Redux.",
      },
      {
        id: "react-v4",
        title: "Lecture 4: Production Project - Building a Scalable Dashboard",
        duration: "1 hr 30 mins",
        instructor: "Full Stack Engineer",
        embedId: "f55qeKGgB_0",
        summary: "Component composition, code splitting with React.lazy, lazy loading routes, and clean folder structures.",
      },
    ],
    modules: [
      {
        title: "Module 1: Virtual DOM & Reconciliation",
        summary: "Diffing algorithm, React Fiber, keys in lists, batch updates.",
        content: `### 1. React Fiber Architecture
React Fiber is a complete rewrite of React's reconciliation engine. It enables incremental rendering: breaking work into chunks and prioritizing updates.

### 2. Diffing Rules
- Elements of different types produce completely different trees.
- React uses the \`key\` prop to match children across different render passes. Never use \`Math.random()\` or array index if list can reorder!`,
      },
      {
        title: "Module 2: Advanced React Hooks Deep Dive",
        summary: "useMemo, useCallback, useRef, and creating custom hooks.",
        content: `### Custom Hook: useDebounce
\`\`\`javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\``,
      },
      {
        title: "Module 3: State Management & Redux Toolkit",
        summary: "Context API vs Redux Toolkit, createSlice, createAsyncThunk.",
        content: `### 1. When to use Redux vs Context
- **Context API:** Best for low-frequency updates (e.g. theme, current authenticated user).
- **Redux Toolkit:** Best for high-frequency, complex state mutations across deeply nested component trees.`,
      },
      {
        title: "Module 4: React Performance Optimization",
        summary: "React.memo, code splitting with React.lazy, Profiler API.",
        content: `### Optimization Checklist
1. Wrap expensive child components in \`React.memo\`.
2. Pass memoized callbacks with \`useCallback\`.
3. Use code-splitting with \`Suspense\` and \`React.lazy\` for route-based chunking.
4. Avoid anonymous objects/functions inline inside render loops.`,
      },
    ],
    interviewQA: [
      {
        q: "What is the difference between useMemo and useCallback?",
        a: "useMemo caches the result of a function calculation. useCallback caches the function definition itself between renders to preserve referential equality.",
      },
      {
        q: "What causes unnecessary re-renders in React and how to avoid them?",
        a: "Unnecessary re-renders are caused by state changes in parent components, non-memoized objects or inline functions passed as props, and unoptimized context values. Solutions include React.memo, useCallback, useMemo, and splitting context.",
      },
    ],
  },

  javascript: {
    id: "javascript",
    title: "JavaScript Advanced - Language Core & Async Engineering",
    videos: [
      {
        id: "js-v1",
        title: "Lecture 1: JavaScript Execution Context, Call Stack & Hoisting",
        duration: "42 mins",
        instructor: "Core JS Architect",
        embedId: "ZvbzSrg0afE",
        summary: "Detailed look at memory allocation phase, code execution phase, lexical environments, and hoisting rules.",
      },
      {
        id: "js-v2",
        title: "Lecture 2: Closures, Scope Chain & First-Class Functions",
        duration: "48 mins",
        instructor: "Senior Frontend Lead",
        embedId: "qikxEIxsXco",
        summary: "Real-world closure applications, data privacy, function currying, and memoization patterns.",
      },
      {
        id: "js-v3",
        title: "Lecture 3: Asynchronous JS, Event Loop, Microtasks & Promises",
        duration: "58 mins",
        instructor: "V8 Internals Specialist",
        embedId: "8zKuNo4ay8E",
        summary: "Microtask queue vs callback queue, Promise states, async/await polyfills, and promise combinators.",
      },
      {
        id: "js-v4",
        title: "Lecture 4: Prototypes, Prototypal Inheritance & ES6 Classes",
        duration: "50 mins",
        instructor: "Staff Engineer",
        embedId: "1utnkUe3kUQ",
        summary: "Prototype chain, Object.create, constructor functions, __proto__, and modern class syntax.",
      },
    ],
    modules: [
      {
        title: "Module 1: Execution Context & Closures",
        summary: "Lexical scope, closure memory retention, currying.",
        content: `### 1. Closures in Action
A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).

\`\`\`javascript
// Private Counter using Closure
function createCounter() {
  let count = 0;
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    get() { return count; }
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
\`\`\``,
      },
      {
        title: "Module 2: Asynchronous JS & Promises",
        summary: "Promises polyfill, Promise.all vs allSettled, async/await.",
        content: `### Promise Combinators
- \`Promise.all()\`: Fails fast if any promise rejects.
- \`Promise.allSettled()\`: Waits for all to finish, returning status for each.
- \`Promise.race()\`: Resolves/rejects with the fastest promise.
- \`Promise.any()\`: Resolves with first fulfilled promise.`,
      },
      {
        title: "Module 3: Prototypal Inheritance & 'this' Keyword",
        summary: "call, apply, bind, arrow functions vs normal functions.",
        content: `### Rules of 'this' Binding:
1. **Default Binding:** In non-strict mode points to global (window); in strict mode is \`undefined\`.
2. **Implicit Binding:** Points to the object left of the dot (e.g. \`obj.fn()\`).
3. **Explicit Binding:** Set using \`.call()\`, \`.apply()\`, or \`.bind()\`.
4. **New Binding:** Points to newly created instance inside constructor.
5. **Arrow Functions:** Retain lexical \`this\` from enclosing scope.`,
      },
    ],
    interviewQA: [
      {
        q: "What is the difference between null and undefined?",
        a: "undefined means a variable has been declared but has not yet been assigned a value. null is an explicit assignment value representing the intentional absence of any object value.",
      },
      {
        q: "How does Promise.all() differ from Promise.allSettled()?",
        a: "Promise.all rejects immediately if any input promise rejects. Promise.allSettled waits for all promises to settle regardless of whether they fulfilled or rejected.",
      },
    ],
  },

  "system-design": {
    id: "system-design",
    title: "System Design - High Scale Architecture",
    videos: [
      {
        id: "sd-v1",
        title: "Lecture 1: System Design Fundamentals - Scaling & Load Balancing",
        duration: "55 mins",
        instructor: "Principal Distributed Systems Engineer",
        embedId: "M73UvS18h0Q",
        summary: "Horizontal vs vertical scaling, round-robin, least connections, consistent hashing, and reverse proxies.",
      },
      {
        id: "sd-v2",
        title: "Lecture 2: Caching Strategies (Redis / Memcached) & CDNs",
        duration: "48 mins",
        instructor: "Cloud Architecture Lead",
        embedId: "xpDnVSmGVdI",
        summary: "Cache-aside, write-through, write-back, cache eviction policies (LRU, LFU), and edge caching.",
      },
      {
        id: "sd-v3",
        title: "Lecture 3: Database Sharding, Replication & CAP Theorem",
        duration: "1 hr 05 mins",
        instructor: "Principal Database Engineer",
        embedId: "vvhC64hQZMk",
        summary: "Leader-follower replication, multi-leader, partition keys, split-brain, and PACELC theorem.",
      },
      {
        id: "sd-v4",
        title: "Lecture 4: System Design Case Study - Scalable URL Shortener (TinyURL)",
        duration: "1 hr 15 mins",
        instructor: "Senior Staff Architect",
        embedId: "fMZMm_0ZhK4",
        summary: "Capacity estimations, Base62 encoding, Key Generation Service (KGS), and global low-latency reads.",
      },
    ],
    modules: [
      {
        title: "Module 1: Load Balancing & Consistent Hashing",
        summary: "L4 vs L7 load balancing, health checks, consistent hash rings.",
        content: `### Consistent Hashing
Standard hash mod N causes massive cache invalidations when adding/removing nodes. Consistent hashing maps keys and servers onto a circular 360-degree ring, minimizing keys moved to only K/N when topology changes.`,
      },
      {
        title: "Module 2: Caching Strategies & Eviction Policies",
        summary: "Cache-aside, write-through, write-behind, LRU cache.",
        content: `### Cache Invalidation Patterns
1. **Cache-Aside (Lazy Loading):** App queries cache first. On miss, queries DB, populates cache.
2. **Write-Through:** App writes to cache; cache writes synchronously to DB.
3. **Write-Behind (Write-Back):** App writes to cache; cache writes asynchronously to DB.`,
      },
      {
        title: "Module 3: Database Scaling & CAP Theorem",
        summary: "Replication, sharding by user_id, ACID vs BASE.",
        content: `### CAP Theorem Tradeoffs
- **Consistency (C):** Every read receives the most recent write or an error.
- **Availability (A):** Every request receives a non-error response without guarantee of latest write.
- **Partition Tolerance (P):** System continues to operate despite network partitions.
*In distributed systems over networks, network failure is inevitable, so you must choose CP or AP.*`,
      },
    ],
    interviewQA: [
      {
        q: "What is Consistent Hashing and why is it preferred over mod hashing?",
        a: "Consistent hashing maps nodes and keys to a logical hash ring. When a server joins or leaves, only a small fraction of keys need remapping (K/N), avoiding massive cache stampedes caused by standard modulo hashing.",
      },
      {
        q: "How do you prevent a cache stampede / thundering herd problem?",
        a: "Use locking/mutex so only one worker queries the database on a cache miss, implement probabilistic early expiration (XFetch), or pre-warm caches before expiry.",
      },
    ],
  },

  dsa: {
    id: "dsa",
    title: "DSA Interview Mastery - Algorithmic Strategy",
    videos: [
      {
        id: "dsa-v1",
        title: "Lecture 1: Time & Space Complexity Masterclass (Big O, Big Omega, Big Theta)",
        duration: "45 mins",
        instructor: "Competitive Programming Lead",
        embedId: "FPu9Uld7W-E",
        summary: "Mastering recurrence relations, Master theorem, space trade-offs, and worst vs amortized complexity.",
      },
      {
        id: "dsa-v2",
        title: "Lecture 2: Two Pointers & Sliding Window Patterns",
        duration: "1 hr 10 mins",
        instructor: "FAANG Algorithm Coach",
        embedId: "jM2dhDPYMQM",
        summary: "Fixed window, variable window, longest substring without repeating characters, and subarray sums.",
      },
      {
        id: "dsa-v3",
        title: "Lecture 3: Binary Trees, Binary Search Trees & Graph Traversals",
        duration: "1 hr 20 mins",
        instructor: "Algorithms Specialist",
        embedId: "fAAZ2MWnYV8",
        summary: "BFS (Level Order), DFS (Pre/In/Post), tree height, lowest common ancestor (LCA), and Dijkstra's algorithm.",
      },
      {
        id: "dsa-v4",
        title: "Lecture 4: Dynamic Programming Patterns (0/1 Knapsack, LCS, LIS)",
        duration: "1 hr 35 mins",
        instructor: "Senior Software Engineer",
        embedId: "oBt53YbR9Kk",
        summary: "Overlapping subproblems, optimal substructure, top-down memoization vs bottom-up tabulation.",
      },
    ],
    modules: [
      {
        title: "Module 1: Sliding Window & Two Pointers",
        summary: "Fixed vs dynamic window, cycle detection in linked lists.",
        content: `### Two Pointers: Fast & Slow Pointer (Floyd's Cycle Finding)
\`\`\`javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\``,
      },
      {
        title: "Module 2: Dynamic Programming Patterns",
        summary: "0/1 Knapsack, Longest Common Subsequence, Tabulation.",
        content: `### 1. The 5 Steps to Solve Any DP Problem
1. Define the state clearly in plain English: \`dp[i]\` represents...
2. Formulate the base cases.
3. Identify the state transition equation.
4. Decide iteration direction (bottom-up) or recursion with memoization (top-down).
5. Optimize space complexity from O(N^2) to O(N) or O(1).`,
      },
    ],
    interviewQA: [
      {
        q: "What is the time complexity of QuickSort in the average and worst case?",
        a: "Average case is O(N log N). Worst case is O(N^2), which occurs when the pivot chosen is consistently the smallest or largest element (e.g. on already sorted arrays without randomized pivot).",
      },
      {
        q: "What is the difference between BFS and DFS traversal?",
        a: "BFS explores nodes level by level using a Queue (FIFO), which is optimal for finding the shortest path in unweighted graphs. DFS explores as deep as possible along each branch before backtracking using a Stack or recursion (LIFO).",
      },
    ],
  },
};
