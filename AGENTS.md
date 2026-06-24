<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project instructions for Codex

## General behavior

- Before writing code, inspect the existing project structure.
- Prefer minimal changes over large rewrites.
- Explain the plan before editing files when the task is architectural or unclear.
- Do not invent Next.js APIs from memory. For Next.js-specific behavior, check `node_modules/next/dist/docs/` first.
- If there are existing patterns in the project, follow them instead of introducing a new style.

## Subagent policy

Use subagents only when explicitly requested or when the task is broad enough to touch multiple areas.

Good cases for subagents:

- feature review
- architecture review
- debugging across multiple files
- PR review
- refactor planning
- test failure investigation

Do not use subagents for tiny one-file fixes.

## Default subagents for React / Next tasks

When I ask to use subagents for a React or Next.js task, spawn relevant subagents:

1. React Logic Agent
   Checks:

- component state
- hooks
- effects
- context
- rendering behavior
- event handlers
- stale closures
- derived state

2. TypeScript Agent
   Checks:

- props
- entity types
- context types
- unsafe any
- null/undefined issues
- function signatures

3. Architecture Agent
   Checks:

- folder structure
- feature ownership
- imports
- boundaries
- API shape
- whether code belongs in component, hook, context, feature, entity, or shared layer

4. UI/UX Agent
   Checks:

- loading states
- empty states
- disabled states
- validation
- basic accessibility
- obvious layout issues

Each subagent should return:

- files inspected
- findings
- evidence
- minimal fix recommendation

The main agent should:

- merge subagent results
- remove duplicates
- classify issues as critical / medium / minor
- give a concrete implementation plan
- ask before editing files if I requested analysis only
