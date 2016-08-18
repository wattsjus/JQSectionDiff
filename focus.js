$.fn.focusGroup = function(params) { 
	var focus_group = $(this);
	var currName = params.name
	var children = params.children || 'direct';
	if(!currName)
		throw "focus-group must have a name";
	if($.inArray(currName, $.fn.focusGroup.prototype.groupNames) > -1)
		throw currName + " focus-group name is duplicated";
	$.fn.focusGroup.prototype.groupNames.push(currName);
	var decendants;
	if(children == "all") {
		decendants = focus_group.find('*');
	} else if(children == 'direct') {
		decendants = focus_group.find(':first-child, * > [persistant]');
	} else {
		throw "invalid children mode for focus-group " + currName;
	}
	var currFormVal = decendants.serializeObject();
	$.fn.focusGroup.prototype.groupFormValues[currName] = currFormVal;
	decendants.each(function(i2, elem2) {
		elem2 = $(elem2);
		if(elem2.blur)
			elem2.blur(function(a) {
				$.fn.focusGroup.prototype.processEvent(a, focus_group, decendants, params, "blur");
			});
		if(elem2.focus)
			elem2.focus(function(a) {
				$.fn.focusGroup.prototype.processEvent(a, focus_group, decendants, params, "focus");
			});
	});
};
$.fn.focusGroup.prototype.groupFormValues = [];
$.fn.focusGroup.prototype.groupName = '';
$.fn.focusGroup.prototype.groupNames = [];
$.fn.focusGroup.prototype.processEvent = function(a, focus_group, decendants, params, attrName) {
	if(params.name != $.fn.focusGroup.prototype.groupName) {
		if(a.originalEvent && 
			(a.relatedTarget == null || -1 == decendants.index(a.originalEvent.relatedTarget))) 
		{
			if(params.onchange) {
				var currFormVal = decendants.serializeObject();
				if($.fn.focusGroup.prototype.groupFormValues[params.name] !== currFormVal) {
					var changes = getChanges(currFormVal, params.name);
					if(changes != null) {
						params.onchange(params.name, currFormVal, changes);
						$.fn.focusGroup.prototype.groupFormValues[params.name] = currFormVal;
						for(var form in $.fn.focusGroup.prototype.groupFormValues) {
							for(var change in changes) {
								if(!!$.fn.focusGroup.prototype.groupFormValues[form][change]) {
									if($.isArray(changes[change]) || $.isPlainObject(changes[change])) {
										$.extend($.fn.focusGroup.prototype.groupFormValues[form][change], changes[change]);
									} else {
										$.fn.focusGroup.prototype.groupFormValues[form][change] = changes[change];
									}
								}
							}
						}
					}
				}
			}
			if(params["on"+attrName]) {
				params["on"+attrName](params.name);
			}
		}
		$.fn.focusGroup.prototype.groupName = params.name+"|"+attrName;
	}	
	function getChanges(obj, name) {
		var prev = $.fn.focusGroup.prototype.groupFormValues[name];
		return _getChanges(obj, prev);
	}
	function _getChanges(obj, prev) {
		var changed = null;
		var persistedFields = [];
		if(obj.persistantFields) {
			persistedFields = obj.persistantFields;
			delete obj['persistantFields'];
		}
		var hasChanges = false;
		for(var prop in prev) {
			var persistant = $.inArray(prop, persistedFields) > -1;
			if(prop != 'persistantFields' && (persistant || prev[prop] !== obj[prop])) {
				if($.isArray(prev[prop]) || $.isPlainObject(prev[prop])) {
					var change = _getChanges(obj[prop], prev[prop]);
					persistant = true;
					if(change != null) {
						if(changed == null) changed = {};
						changed[prop] = change;
						persistant = false;
					}
				} else {
					if(changed == null) {
						if($.isArray(obj)) {
							changed = [];
						} else {
							changed = {};
						}
					}
					changed[prop] = obj[prop];
				}
				hasChanges |= !persistant;
			}
		}
		if(hasChanges)
			return changed;
		else
			return null;
	}
};
