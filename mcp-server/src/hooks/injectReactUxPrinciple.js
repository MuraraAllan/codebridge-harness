async function run() {
  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext:
        "React UX principle context is active. Use .agents/skills/react-ux-principle/SKILL.md and its linked ux-principles.md source for navigation, interaction feedback, user attention, and user journey decisions.",
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in injectReactUxPrinciple: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
