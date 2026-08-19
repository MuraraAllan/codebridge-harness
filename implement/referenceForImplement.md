react-principles each becomes one skill
prepare the mds and organize accordingly with custom instructs
Prepare the ground for compositional agents

decide where to inject or dont, leave it pre-made / ready to go
{
"$schema": "https://raw.githubusercontent.com/microsoft/vscode/main/src/vs/workbench/contrib/chat/browser/schemas/hooks.schema.json",
  "name": "echo-harness-plugin",
  "version": "1.0.0",
  "description": "Agent harness hook that injects 1234 into the session context",
  "hooks": [
    {
      "event": "agent.onSessionStart",
      "command": "powershell.exe",
      "args": ["-ExecutionPolicy", "Bypass", "-File", "${workspaceFolder}/.github/hooks/echo_hook.ps1"],
"injectAsContext": true
}
]
}

<<< remember to deal with "github.copilot.chat.codeGeneration.useInstructionFiles": true,
"github.copilot.chat.customInstructions": [
{
"text": "Always write strict TypeScript types, prefer async/await over promises, and include unit tests for new functions."
}
]>>>

<<< We need to reconfigure hook accordingly with @

FeedForward(>>> after deflush(>> based on taskGroundingContext, lets implement the tasks based on userMessage

userMessage Is :
now based on @Agent Customization, we will iterate over @hooks, formalizing our composition.
Don't extend or suggest instructions, focus more in the composition, based on @custominstructions Preparing the ground for compositional agents as deflush(>>> taskGroundingContext states.

FeedForward(>>> FeedForward(>> FlushBack{L1,1 <<<< therefore extend reflect(>>> My task is to build a taskList composed of todo based on userMessageTaskList. I must iterate over userMessage and userMessageProposedChanges, into deflush(>>> userMessageTaskList.

userMessageProposedChanges : userMessageProposedTaskList :

1 - reflect(>>> Iterate over @react-principles, extending each one to an individual skill "react-skillName-principle". Don't extend or change the text, just make it as skills.
2 - reflect(>>> create an example of always on instructionsfor codebridge-react-router-harness agent ( one for claude one for copilot one for main agent)
3 - reflect(>>> create an example of injectContext instruction based on @injectcontext.txt ( one for claude one for copilot one for main agent) (always on, global)
4- reflect(>>> Break codebridge-react-router-harness into two agents initially. The agent ( plugin holder is the react-router-harness ). Respecting our @codeinstructs we compose it from react-router-harness, the reason that we are kind of doing it opposites will be discussed later, from super connected graph members. I want codebridge-harness to be an agent, that respects and implements every one of the previous itens, respecting the @subagentkickoff and @subAgentsChildrenParentsAndSiblings.md
5 - reflect(>>>> based on the new skills added to react-principles, intersects deflush(>>> Task 2 and task 4, create a link inbetween orientation to provide a guide to when use each of the skills "automatically" (global!) based on @customInstructonsKicoff and @injectContext

deflect(>>> before processing, FeedForward(>> reflect(>>> deflush(<<< over @agentPrototyping, we are going towards this area. so based on @basicboilerplate into FlushBack{L1,3 as taskGroundingContext
