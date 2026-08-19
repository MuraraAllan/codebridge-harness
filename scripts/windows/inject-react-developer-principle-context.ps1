[CmdletBinding()]
param()

@{
    hookSpecificOutput = @{
        hookEventName = "SessionStart"
        additionalContext = "React developer principle context is active. Use .agents/skills/react-developer-principle/SKILL.md and its linked developer-principles.md source for component architecture, composition, specialization, state, and abstraction decisions."
    }
} | ConvertTo-Json -Depth 4 -Compress