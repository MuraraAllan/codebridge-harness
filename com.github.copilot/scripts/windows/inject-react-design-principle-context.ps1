[CmdletBinding()]
param()

@{
    hookSpecificOutput = @{
        hookEventName = "SessionStart"
        additionalContext = "React design principle context is active. Use .agents/skills/react-design-principle/SKILL.md and its linked design-principles.md source for visual design, accessibility, responsiveness, and frontend performance decisions."
    }
} | ConvertTo-Json -Depth 4 -Compress