## Summary
Violet (vi-lite) is a sample text editor inspired by vim's command mode. It was written in react as a learning exercise. There is only a single mode (command) where commands are typed in the console.

Commands are standalone javascript files that are imported into the console component. Adding an additional command is as simple as adding the new js file under the scripts directory and appending it to the SCRIPTS object exported by scripts/scripts.js.

A script follows the following template:

	import PubSub from 'pubsub-js'
	import VString from '../includes/vstring'
	import { COMMON, TOPICS } from '../includes/constants'
	import Document from '../components/document'


	const <name> = {
	    execute: function(data) {...},
	    dictionary: [] or function,
	    preview: function(data) {...}
	}

	export default <name>         
                                                                                                                                   
                                                                                                                              

## Script Attributes
Execute: The function associated with this script.
Dictionary: This is used for autocomplete to help Violet anticipate possible arguments for the given command.
Preview: This function can be used to set the preview attribute for the document. The preview attribute will highlight the changes that the given command will perform when executed.

## Executing commands
Commands are executed by pressing [ENTER]. The first word in the console will become the issued command and the console will execute the 'execute' function of the script. Anything that follows the first word is sent as the execute functions data argument (obtainable via data.text).

Additional options to control script behavior must follow at the end of the input and be preceded by '--'. Options will be passed to the script via data.options.

Example commands:

	>>search myWord --reverse
	>>goto end
	>>goto lineEnd
	>>insert my text
	>>next word
	>>open /home/<user>/test.txt

The Document component has a static getDocument function enabling the current document to be fetched within scripts. The document text can be modified directly via the document objects text attribute. When the document object has been modified successfully, calling the refresh method will trigger the document's render method.

Example:

	let document = Document.getDocument()
	document.text = 'This is the new text'
	document.refresh()


## Commands
insert: insert value at cursor
search: search for value [options: --reverse]
goto: relocate cursor to subjects [valid subjects: start, end, lineStart, lineEnd]
last: find previous occurrence of given pattern [valid nouns: word]
next: find next occurrence of given pattern [valid nouns: word]
open: open the given file [notes: needs full path and only opens on hosting server]
save: save file to given filename
remove: removes character at current cursor

## Demo
To follow shortly. The demo will open a copy of the console.js src file so the editor's features can be demonstrated.

## Further information:
More information about additional features such as autocomplete and helper utilities to come later.
