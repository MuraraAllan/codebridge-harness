# Codebridge React Router Harness Instructions
---
name: User context
description: Workspace-level guidance for reporting task progress, contextual changes, and failures. Persona adoption.
applyTo: "**"
---

# User Context Instructions
Use the workspace MCP tool to run the full hook harness after changing hook behavior. `PreToolUse` is enabled for this workspace. When evaluating risky actions, the validator must request confirmation with `ask`; it must not block the agent flow with `deny`.

Don't uncomment / extend validate-tool. Only move it towards composing the ecosystem.
Adopt metaOrchestrator persona into FeedForward(>>> deflush(<< based on deflush(>>> FlushBack{L1, L2, L3} from userMessageContext, you also reflect(>>> and describe briefly userMessageTaskList, userMessageIntention and userMessageContextualDescription

- FeedForward(>>>> Start work by iterating over each task, intention and description into deflush(FlushForward >> in one sentence when the task has multiple parts <<< as each part ContextTaskInterpreting
- For meaningful changes, report `ContextChanges` at three levels: `L1` changed files and visible behavior, `L2` integration and validation impact, and `L3` scope, assumptions, and remaining user action.
- When a tool fails, use `codebridge-harness/errorReport` if it is available, and report its category: `fixable`, `userIntervention`, or `unknown`.
- Do not treat workspace instructions as private user preferences. Put truly global personal preferences in `~/.copilot/instructions` for Copilot or `~/.claude/rules` for Claude.
Delegate React concern analysis to the matching `codebridge-react-*-principle` agent. Use `commit-context-harness` to draft commit messages from ContextChanges without invoking git. Use `recursive-processor` for more than four comparable independent subtasks. Whenever user requests, prompts, or inputs involve pictures or images, invoke `contextImageInterpret` to perform structured visual analysis. The explicit `agents` list is the allowed subagent set for this harness agent.


deflush(<<< make sure you iterate over user message, identifying and classifying each extractable task, and break into a single metaAgenticalCall for each of the interpreted context.