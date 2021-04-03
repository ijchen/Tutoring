function jumpToBottom() {
	window.scrollTo({
		top: document.body.scrollHeight,
		behavior: "smooth"
	});
}

// Stop the button from getting focus when clicked (otherwise, it will have an
// ugly outline). I'm not using `outline: none;` in css for accessibility
// reasons (difficult to navigate for keyboard users)
document.getElementById("jumpToBottomBtn").addEventListener("mousedown", e => {
	e.preventDefault();
});