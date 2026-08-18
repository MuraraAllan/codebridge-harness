#!/usr/bin/env bash
# set -euo pipefail

# input="$(cat)"
# tool_name="$(printf '%s' "$input" | jq -r '.tool_name // empty')"
# command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
# file_path="$(printf '%s' "$input" | jq -r '.tool_input.filePath // empty')"

# if [[ "$tool_name" == "run_in_terminal" || "$tool_name" == "execute_command" ]]; then
#   if [[ "$command" =~ rm[[:space:]]+-rf|DROP[[:space:]]+TABLE|git[[:space:]]+push[[:space:]]+--force ]]; then
#     jq -cn --arg command "$command" '{
#       hookSpecificOutput: {
#         hookEventName: "PreToolUse",
#         permissionDecision: "ask",
#         permissionDecisionReason: ("Destructive command detected ('" + $command + "') requires manual confirmation.")
#       }
#     }'
#     exit 0
#   fi
# fi

# if [[ "$tool_name" == "edit_file" || "$tool_name" == "write_file" ]]; then
#   if [[ "$file_path" =~ \.env$|prod\.json$ ]]; then
#     jq -cn --arg filePath "$file_path" '{
#       hookSpecificOutput: {
#         hookEventName: "PreToolUse",
#         permissionDecision: "ask",
#         permissionDecisionReason: ("Modifying sensitive configuration file (" + $filePath + ") requires manual confirmation.")
#       }
#     }'
#     exit 0
#   fi
# fi

jq -cn '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow"
  }
}'

