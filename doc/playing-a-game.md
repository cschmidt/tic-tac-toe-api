    wscat -c [Websocket URL]
    > {"commands":[{"start_game": {}}]}
    < {"session_id":"UE6igc4aPHcAdgQ=","events":[{"game_started":{...,"id":"7lENwX8pKyHhgwHwBIgu1"}}]}
    > {"commands":[{"make_move": {"game_id": "7lENwX8pKyHhgwHwBIgu1", "square": "a1", "mark": "X", "move_number": 1}}]}
    < {"session_id":"UE6igc4aPHcAdgQ=","events":[{"move_made":{"game_id":"7lENwX8pKyHhgwHwBIgu1","square":"a1","move_number":"?","mark":"X"}}]}
