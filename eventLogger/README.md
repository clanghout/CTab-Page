# Event Logger
Since the json format gets too big for session storage really fast (per update) the idea is to save the state of the CTab-Page per event instead of only the current configuration. A list of events then forms the current state of the dashboard.

## Ideas
- Session storage:
    - Full log: push every change
    - Changes based on 'device' (every unique origin) base on state of localstorage.
    - Just compare configurations. Find out if the session storage is only for adding or also object size & retrieval.
    - 
    
    
Alternative is to trim down the size of the json configuration.
- by minifying the object names
- or by saving a new array after every n items.