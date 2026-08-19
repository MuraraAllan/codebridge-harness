Subagents in Visual Studio Code
When working on complex tasks, you can delegate subtasks to subagents. A subagent is an independent AI agent that performs focused work, such as researching a topic, analyzing code, or reviewing changes, and reports the results back to the main agent.

Tip
To run deep research that produces a standalone, shareable report rather than feeding results back into your main conversation, use the built-in research agent in Copilot sessions.

For background on subagent concepts (context isolation, synchronous and parallel execution), see Agents concepts.

This article explains how to use subagents in VS Code, including usage scenarios, invocation patterns, and how to run custom agents as subagents.

When to use subagents
The following scenarios illustrate when subagents can improve your AI-assisted development workflow.

Research before implementation
Parallel code analysis
Explore multiple solutions
Code review with specialized focus
Multi-model consensus
Invoke a subagent
How subagents are invoked
Subagents are typically agent-initiated, not directly invoked by users in chat. To allow the main agent to invoke subagents, make sure the agent/runSubagent tool is enabled.

By default, subagents themselves cannot invoke further subagents. To enable recursive nesting, enable the
chat.subagents.allowInvocationsFromSubagents
setting. Learn more in Nested subagents.
The main agent decides when context isolation helps. You don't need to manually type "run a subagent" for every task. The pattern works like this:

You (or your custom agent's instructions) describe a complex task.
The main agent recognizes the part of the task that benefits from isolated context.
The agent starts a subagent, passing only the relevant subtask.
The subagent works autonomously and returns a summary.
The main agent incorporates the result and continues.
You can hint that you want subagent delegation by phrasing your prompt to suggest isolated research or parallel analysis. The main agent will start a subagent, pass the task to it, and receive only the final result.

Each subagent invocation is stateless. The main agent can't send follow-up messages to the same subagent, so include all relevant context and expected output in the task. The built-in tools for asking clarifying questions and managing todo items are unavailable to subagents.

Tip
For consistent subagent behavior, define when to use subagents in your custom agent's instructions rather than prompting for them manually each time.

To optimize subagent performance, clearly define the task and expected output. This helps the subagent focus on the specific goal without passing unnecessary context back to the main agent.

See the usage scenarios section for examples of how to structure prompts that invoke subagents.

Invoke a subagent in a prompt file
To invoke a subagent inside a prompt file, ensure that the runSubagent or agent tool is included in the tools frontmatter property:

Markdown

---

name: document-feature
tools: ['agent', 'read', 'search', 'edit']

---

Run a subagent to research the new feature implementation details and return only information relevant for user documentation.
Then update the docs/ folder with the new documentation.
In the prompt instructions, you can then hint the agent to use subagents by suggesting isolated research or parallel analysis for specific subtasks.

What you see in chat
In the Chat view, a running subagent appears as a collapsible tool call. By default, the subagent is collapsed and shows:

The name of the custom agent (if you specify one)
The currently running tool (for example, "Reading file..." or "Searching codebase...")
Select the subagent tool call to expand it and view the full details, including all tool calls the subagent made, the prompt passed to the subagent, and the returned result.

In the Agents window, each subagent is available as a read-only peer chat. The parent chat shows an indicator with the subagent's model, elapsed time, and active tool call. Select the indicator to open the subagent while keeping the parent chat open.

Subagent chats are hidden from the tab strip by default. Open one in any of these ways:

Select it from the Conversations dropdown.
Select the running-subagents indicator while subagents are active.
Select Open Subagent in the chat where the delegation occurred.
Read-only subagent chats show a lock icon and don't accept input. They persist across window reloads with your other chats.

Screenshot showing a read-only subagent chat in the Agents window.

By default, chat editors use a rich presentation that opens each subagent in its own editor instead of showing its full activity inline in the parent chat. Disable the
chat.subagents.useRichRendering
setting to show subagent activity inline.
Note
Hover over a subagent section in the chat response to see the AI credits used by that subagent. This gives you more transparency into the cost of delegated work.

You control how much detail to reveal without cluttering your main conversation with intermediate steps.

Run a custom agent as a subagent
By default, a subagent inherits the agent from the main chat session and uses the same model and tools. To define specific behavior for a subagent, use a custom agent. Custom agents can specify their own model, tools, and instructions. When used as a subagent, these settings override the defaults inherited from the main session.

The main agent can also request a specific model when invoking a subagent. Learn more in the Select the model for a subagent section.

Control how a custom agent is invoked
You can control how a custom agent can be invoked by using two frontmatter properties:

user-invocable: controls whether the agent appears in the agents dropdown in chat (default is true). Set to false to create agents that are only accessible as subagents.
disable-model-invocation: prevents the agent from being invoked as a subagent by other agents (default is false). Set to true when agents should only be triggered explicitly by users.
For example, to create an agent that can only be used as a subagent (not visible in the dropdown):

Markdown

---

name: internal-helper
user-invocable: false

---

This agent can only be invoked as a subagent.
Note
The infer property is deprecated. Use user-invocable and disable-model-invocation instead for more granular control.

To run a custom agent as a subagent, prompt the AI to use a custom or built-in agent for the subagent. For example:

Run the Research agent as a subagent to research the best auth methods for this project.
Use the Plan agent in a subagent to create an implementation plan for myfeature. Then save the plan in plans/myfeature.plan.md
Agent names are case-sensitive. Use the exact name from the custom agent definition.

Restrict which subagents an agent can use
By default, all custom agents that don't have disable-model-invocation: true are available to be used as subagents. If two or more agents have similar names or descriptions, the AI might select an unintended agent.

You can restrict which custom agents can be used as subagents by specifying the agents property in the main agent's frontmatter, and providing a list of allowed custom agents.

The agents property accepts:

A list of agent names (for example, ['Edit', 'Search']) to allow only specific agents

- to allow all available agents (default behavior)
  An empty array [] to prevent any subagent use
  Note
  Explicitly listing an agent in the agents array overrides disable-model-invocation: true. This means you can create agents that are protected from general subagent use but still accessible to specific coordinator agents that explicitly allow them.

For example, a test-driven development (TDD) agent should only use the Red, Green, and Refactor agents as subagents. If not restricted, the TDD agent might select a more generic coding agent for implementing the tests instead of the specialized TDD agents.

Markdown

---

name: TDD
tools: ['agent']
agents: ['Red', 'Green', 'Refactor']

---

Implement the following feature using test-driven development. Use subagents to guide the following steps:

1. Use the Red agent to write failing tests
2. Use the Green agent to implement code to pass the tests
3. Use the Refactor agent to improve the code quality
   Select the model for a subagent
   When a subagent runs, the model is determined by the following priority order:

Explicit model parameter: the main agent specifies a model directly when invoking the runSubagent tool.
Agent-configured model: the model property in the custom agent's .agent.md frontmatter. This can be a single model name or a prioritized list of models.
Main model: the model running the parent conversation.
To request a specific model for a subagent, include a model preference in your prompt:

Run a subagent with Claude Sonnet 4.6 to research authentication patterns in this codebase.
Use GPT-4o in a subagent to analyze the performance of this module.
You can also define the model preference in your custom agent's instructions to consistently route subagent tasks to a specific model.

Note
The requested model cannot exceed the cost tier of the main model. If you request a more expensive model, the subagent doesn't run and reports which models are available.

Nested subagents
By default, subagents cannot spawn further subagents. This prevents infinite recursion when agents accidentally call themselves in a loop. However, some workflows benefit from recursive delegation, for example, a divide-and-conquer agent that splits a large task into smaller pieces and delegates each piece to itself.

To enable nested subagents, enable the
chat.subagents.allowInvocationsFromSubagents
setting (false by default). When enabled, subagents can spawn their own subagents, up to a maximum nesting depth of 5.
Example: recursive agent
A recursive agent lists itself in its own agents property. This enables divide-and-conquer patterns where the agent breaks a problem into smaller parts and delegates each part to a new instance of itself.

Markdown

---

name: RecursiveProcessor
tools: ['agent', 'read', 'search']
agents: [RecursiveProcessor]
argument-hint: A list of items to process

---

You process a list of items by dividing and conquering:

- If the list has more than 4 items, split it in half and delegate each half to a RecursiveProcessor subagent.
- If the list has 4 or fewer items, process the items directly.
- Merge the results from each subagent into a final result.
  Orchestration patterns
  Subagents enable orchestration patterns where a coordinator agent delegates work to specialized worker agents. This approach helps you build sophisticated workflows while keeping each agent focused on what it does best.

Coordinator and worker pattern
A coordinator agent manages the overall task and delegates subtasks to specialized subagents. Each worker agent can have a tailored set of tools. For example, planning and review agents need only read-only access, while the implementer needs edit capabilities.

Markdown

---

name: Feature Builder
tools: ['agent', 'edit', 'search', 'read']
agents: ['Planner', 'Plan Architect', 'Implementer', 'Reviewer']

---

You are a feature development coordinator. For each feature request:

1. Use the Planner agent to break down the feature into tasks.
2. Use the Plan Architect agent to validate the plan against codebase patterns.
3. If the architect identifies reusable patterns or libraries, send feedback to the Planner to update the plan.
4. Use the Implementer agent to write the code for each task.
5. Use the Reviewer agent to check the implementation.
6. If the reviewer identifies issues, use the Implementer agent again to apply fixes.

Iterate between planning and architecture, and between review and implementation, until each phase converges.
The worker agents each define their own tool access and can pick a faster or more cost-effective model since they have a narrower focus:

Markdown

---

name: Planner
user-invocable: false
tools: ['read', 'search']

---

Break down feature requests into implementation tasks. Incorporate feedback from the Plan Architect.
Markdown

---

name: Plan Architect
user-invocable: false
tools: ['read', 'search']

---

Validate plans against the codebase. Identify existing patterns, utilities, and libraries that should be reused. Flag any plan steps that duplicate existing functionality.
Markdown

---

name: Implementer
user-invocable: false
model: ['Claude Haiku 4.5 (copilot)', 'Gemini 3 Flash (Preview) (copilot)']

---

Write code to complete assigned tasks.
This pattern keeps the coordinator's context focused on the high-level workflow while each worker agent has a clean context and appropriate permissions for its specific job.

Multi-perspective code review
Code review benefits from multiple perspectives. A single pass often misses problems that become obvious when you look through a different lens. Use subagents to run each review perspective in parallel, then synthesize the findings.

Markdown

---

name: Thorough Reviewer
tools: ['agent', 'read', 'search']

---

You review code through multiple perspectives simultaneously. Run each perspective as a parallel subagent so findings are independent and unbiased.

When asked to review code, run these subagents in parallel:

- Correctness reviewer: logic errors, edge cases, type issues.
- Code quality reviewer: readability, naming, duplication.
- Security reviewer: input validation, injection risks, data exposure.
- Architecture reviewer: codebase patterns, design consistency, structural alignment.

After all subagents complete, synthesize findings into a prioritized summary. Note which issues are critical versus nice-to-have. Acknowledge what the code does well.
This pattern works because each subagent approaches the code fresh, without being anchored by what other perspectives found. In this example, the orchestrator shapes each subagent's focus area through its prompt. This is a lightweight approach that requires no additional agent files.

Tip
For more control, each review perspective can be its own custom agent with specialized tool access. For example, a security reviewer might use a security-focused MCP server, while a code-quality reviewer might have access to linting CLI tools. This approach lets each perspective use the best tools for its specific focus.

Related resources
