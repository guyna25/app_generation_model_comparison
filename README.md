A test for MVP for different coding tools:
- Claude code
- Gemini cli
- ChatGPT codex
- Grok3 (through cursor)

Using Github spec kit all models were given the same instructions:
1. /speckit.specify -Build an application managing a todo list that can help me organize the tasks that I have to do. Users can add, remove and edit todo items. Items have a title, description, due date and ‘done’ checkmark. Items must be validated (title min 4 chars, max 100. Description - min 0, max 500). Users can add, remove, mark completed and delete items. 
2. /speckit.plan - use tailwind.css next.js node localDB and mongoDB
3. /speckit.clarify - to improve planning 
4. /speckit.tasks - to create a task list
5. /speckit.implement

The models displayed similar results with Claude producing the best UI. Gemini showing better reasoning about feature requests and expanding them and ChatGPT was able to do a decent job with no quota hits. 
