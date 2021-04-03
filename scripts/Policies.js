// Add collapsible functionality to collapsible elements
for(let elem of document.getElementsByClassName("collapsibleParent")) {
	let collapsed = true; // Assume they start collapsed (done in the css)
	
	// Get a list of collapsible children
	let collapsibleChildren = [];
	for(let child of elem.children) {
		if(child.classList.contains("collapsible")) {
			collapsibleChildren.push(child);
		}
	}
	
	// Get a list of collapsible toggle elements (clicked to show/hide)
	let toggleChildren = [];
	for(let child of elem.children) {
		if(child.classList.contains("collapsibleToggle")) {
			toggleChildren.push(child);
		}
	}
	
	// Add functionality to the toggle children
	for(let toggle of toggleChildren) {
		// Allow users to use the keyboard to focus the toggle
		toggle.tabIndex = 0;
		
		// Add a click event to show or hide the content (any collapsible children)
		toggle.addEventListener("click", e => {
			for(let child of collapsibleChildren) {
				if(collapsed) {
					child.style.transition = "max-height 250ms ease-out, border-bottom 0ms ease-out 0ms";
					child.style.borderBottomWidth = "5px";
					child.style.maxHeight = `${Math.ceil(child.scrollHeight)}px`;
				} else {
					child.style.transition = "max-height 250ms ease-in, border-bottom 0ms ease-in 265ms";
					child.style.borderBottomWidth = "0";
					child.style.maxHeight = "0";
				}
			}
			
			// If it was collapsed, it isn't now, and vice-versa
			collapsed = !collapsed;
		});
		
		// Stop the toggle from getting focus when clicked (otherwise, it will
		// have an ugly outline). I'm not using `outline: none;` in css for
		// accessibility reasons (difficult to navigate for keyboard users)
		toggle.addEventListener("mousedown", e => e.preventDefault());
		
		// Add a key event that clicks if the user pressed space or enter
		// For accessibility
		toggle.addEventListener("keydown", e => {
			if(e.key === "Enter" || e.key === " ") e.target.click();
		});
	}
}