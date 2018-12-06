

    # Create a new session
    curl -i -X POST https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/sessions

    # Post a 'start game' command
    curl --include \
      --header "Content-Type: application/json" \
      --request POST \
      --data '{"session_id":"4740dce0-dbef-11e8-814f-2b9b58b1ff04", "commands":[{"start_game": {}}]}' \
      https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/commands

    # Post a 'make move' command
    curl --include \
      --header "Content-Type: application/json" \
      --request POST \
      --data '{"session_id":"4740dce0-dbef-11e8-814f-2b9b58b1ff04", "commands":[{"make_move": {"game_id": "3NHsUhW48SlBB95FmQ-3R", "square": "a1", "mark": "X", "move_number": 1}}]}' \
      https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/commands

    curl --include \
      --header "Content-Type: application/json" \
      --request POST \
      --data '{"session_id":"4740dce0-dbef-11e8-814f-2b9b58b1ff04", "commands":[{"make_move": {"game_id": "3NHsUhW48SlBB95FmQ-3R", "square": "a2", "mark": "O", "move_number": 2}}]}' \
      https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/commands

    curl --include \
      --header "Content-Type: application/json" \
      --request POST \
      --data '{"session_id":"4740dce0-dbef-11e8-814f-2b9b58b1ff04", "commands":[{"make_move": {"game_id": "3NHsUhW48SlBB95FmQ-3R", "square": "c3", "mark": "X", "move_number": 3}}]}' \
      https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/commands
