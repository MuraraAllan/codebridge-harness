async function run() {
  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext:
        "React developer principle context is active. Use .agents/skills/react-developer-principle/SKILL.md and its linked developer-principles.md source for component architecture, composition, specialization, state, and abstraction decisions.",
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in injectReactDeveloperPrinciple: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
