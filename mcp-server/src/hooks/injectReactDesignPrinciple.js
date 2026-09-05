async function run() {
  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext:
        "React design principle context is active. Use .agents/skills/react-design-principle/SKILL.md and its linked design-principles.md source for visual design, accessibility, responsiveness, and frontend performance decisions.",
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in injectReactDesignPrinciple: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
