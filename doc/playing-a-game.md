

    # Create a new session
    curl -i -X POST https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/sessions

    # Post a 'start game' command
    curl --include \
      --header "Content-Type: application/json" \
      --request POST \
      --data '{"session_id":"4740dce0-dbef-11e8-814f-2b9b58b1ff04", "commands":[{"start_game": {}}]}' \
      https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/commands
