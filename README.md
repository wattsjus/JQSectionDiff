# JQSectionDiff
Using jQuery to find what has changed in the input fields of a section of the DOM.  This plugin allows you to use elements to create sections that have their own onchange, onfocus, on blur events.  The onchange event will show you all the values serialized as a JSON object and also what has changes since the last time the section had focus.

JS Example:
```			$("#Section").focusGroup(
				{	name:		"ChangeTracker",
					onfocus:	onFocus, //focus event for entire section of #Section
					onblur:		onBlur, //blur event for entire section of #Section
					onchange:	onChange  //change event for entire section of #Section,
					children:	"all"  //including even grandchildren and lower in the change tracking
				}
			);
```
HTML Example:

```			<input type="hidden" name="addressId" value="9823592" persistant /> 
			<!-- by adding the property persistant in the lowest level the value will be persisted in all changes and will not be considered a change unless the section has other changes -->
```
