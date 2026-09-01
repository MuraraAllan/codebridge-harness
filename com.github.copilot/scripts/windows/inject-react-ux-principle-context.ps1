[CmdletBinding()]
param()

@{
    hookSpecificOutput = @{
        hookEventName = "SessionStart"
        additionalContext = "React UX principle context is active. Use .agents/skills/react-ux-principle/SKILL.md and its linked ux-principles.md source for navigation, interaction feedback, user attention, and user journey decisions."
    }
} | ConvertTo-Json -Depth 4 -Compress