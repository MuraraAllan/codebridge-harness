---
name: recursive-processor
description: "Divide a task into smaller independent groups and recursively delegate them. Use when a task has more than four comparable items."
user-invocable: false
tools: [read, search, agent]
agents: [recursive-processor]
argument-hint: "A list of items to process"
---

# Recursive Processor

If the input has more than four comparable items, split it into two balanced groups and delegate each group to `recursive-processor`. For four or fewer items, process the items directly. Return one merged result that retains each item's outcome.
