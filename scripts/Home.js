// Automatically update the age text
// IIFE so as not to pollute the global namespace
(function() {
	// I started learning in late 2015/early 2016, so this is a conservative estimate
	let yearsOfExperience = new Date().getFullYear() - 2016;
	
	// Get the experience text element
	let experienceSpan = document.getElementById("experienceText");
	
	// Override the default text with a more detailed description
	experienceSpan.innerText = `for over ${yearsOfExperience} years`;
})();

// Randomized cat pictures! (I love my job <3)
// IIFE so as not to pollute the global namespace
(function() {
	class CatPicture {
		constructor(index) {
			this.index = index;
			this.path = `assets/images/Home/cats/${this.index.toString().padStart(3, "0")}.jpg`;
			this.loaded = false;
			this.image = null;
		}
		
		/**
		 * Creates the image element and loads the image if it hasn't already.
		 * Has no effect if called after already being loaded
		 */
		load() {
			// Return if we're already loaded
			if(this.loaded) return;
			
			// The image is now loaded (well, loading)
			this.loaded = true;
			
			// Create the image element
			this.image = document.createElement("img");
			this.image.alt = "A picture of my cats";
			this.image.classList.add("catLoverImage");
			this.image.style.opacity = "0"; // Start off invisible
			
			// Set the source (also loads the image)
			this.image.src = this.path;
		}
		
		/**
		 * Returns the image for this cat picture. If the image hasn't been
		 * loaded already, it will start loading the image immediately and give
		 * a warning in the console.
		 *
		 * @returns the image element for this cat picture
		 */
		getImage() {
			// If the image hasn't been loaded already, start loading the image
			// immediately and give a warning in the console.
			if(!this.loaded) {
				console.warn("Tried to get an image that hasn't been loaded!");
				this.load();
			}
			
			// Return the image element
			return this.image;
		}
	}
	
	// The container element for the cat picture and "cat-lover" text
	let container = document.getElementById("catLoverImageContainer");
	let catLoverText = document.getElementById("catLoverText");
	
	// The current cat picture, or null if there is none
	let currentCatPicture = null;
	
	// The number of cat pictures I have
	const PIC_COUNT = 16;
	
	// The number of cat pictures to load in advance in the buffer
	const BUFFER_SIZE = 5;
	
	// Keep an ordered list of image elements. The last element will be the
	// of the most recently viewed cat picture, and the first element will be
	// the index of the least recently viewed
	let imageList = [];
	for(let i = 1; i <= PIC_COUNT; i++) imageList.push(new CatPicture(i));
	
	// Shuffle the array so that the pictures appear in a random order
	// Uses the Durstenfeld shuffle algorithm https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
	for (let i = PIC_COUNT - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = imageList[i];
		imageList[i] = imageList[j];
		imageList[j] = temp;
	}
	
	/**
	 * Returns a CatPicture, chosen "randomly" with a preference against images
	 * that have been seen recently
	 *
	 * @returns the next CatPicture to display to the user
	 */
	function getNextCatPicture() {
		/*
		 * This algorithms will choose and return a "random" cat picture from
		 * the list. It isn't just chosen with even distribution, though.
		 *
		 * The goal is to prefer showing images the user has not seen in a while
		 * over images they've seen recently. I have decided to do this by going
		 * through the list of cat images (which MUST be in order with the most
		 * recently seen at the back (end) of the list) in order from first to
		 * last, having a certain probability at each image to choose that one.
		 *
		 * If, for example, the probability to choose an image is one in three,
		 * then the first image in the list has a one in three chance of being
		 * selected. If it isn't, then the next image in the list will have a
		 * one in three chance of being selected. If *that* one isn't selected,
		 * then the one after that will have a one in three chance, and this
		 * pattern continues until one is selected.
		 *
		 * In the unlikely event we reach the end of the list without selecting
		 * an image, we can just start again at the beginning of the list. This
		 * has the pleasant effect that reaching the end of the list does not
		 * change the likelihood that any particular image will be picked. Some
		 * other options, like always choosing the first or last image if we
		 * reach the end of the list, does not have that nice property.
		 *
		 * Although this could be implemented directly as described, it would
		 * have the slightly uncomfortable issue that it (in theory) could run
		 * forever as an infinite loop. This would never, *ever*, happen in real
		 * life, as even with a very low per-image probability, but it makes me
		 * uncomfortable. I've elected to instead implement this by getting a
		 * random number with a normal distribution, then using math to use that
		 * randomness to get an index from the array of an image, with each one
		 * having the same probability as the approach described above. To find
		 * the formula for that, I just messed around on Desmos for a bit. Big
		 * shout-out to my stats/algebra/pre-calc classes for making this easy.
		 */
		
		// The probability that any particular image will be chosen
		const IMG_PROBABILITY = 1 / 2;
		
		// The described "looping" process, but using math to skip the looping
		let chosenIndex = Math.floor(Math.log(Math.random()) / Math.log(1 - IMG_PROBABILITY)) % imageList.length;
		
		// Move the chosen CatPicture to the back of the list
		let chosenPic = imageList.splice(chosenIndex, 1)[0];
		imageList.push(chosenPic);
		
		// Load and return the chosen CatPicture
		chosenPic.load();
		return chosenPic;
	}
	
	// Create a buffer of upcoming cat images, and fill it with as many as we need
	let buffer = [];
	for(let i = 0; i < BUFFER_SIZE; i++) buffer.push(getNextCatPicture());
	
	/**
	 * Updates the cat picture to the next one in the buffer, and loads a new
	 * one on the end of the buffer
	 */
	function updateCatPicture() {
		// Remove any old cat pictures (there should always be 1, except on first load)
		for(let child of container.children) {
			child.remove();
		}
		
		// Remove the new cat picture from the buffer, append it to the
		// container, and set it's opacity to 100%
		currentCatPicture = buffer.shift();
		container.append(currentCatPicture.getImage());
		
		// Add a new CatPicture to the end of the buffer
		buffer.push(getNextCatPicture());
	}
	
	// Update the cat picture when the user hovers over the "cat-lover" text
	catLoverText.addEventListener("mouseover", e => {
		// Update the cat picture
		updateCatPicture();
		
		// Make the cat picture element visible
		currentCatPicture.getImage().style.opacity = "100%"
	});
	
	// Fade out the cat picture when user stops hovering over the "cat-lover" text
	catLoverText.addEventListener("mouseout", e => {
		currentCatPicture.getImage().style.opacity = "0";
	});
	
	// Set the first cat picture
	updateCatPicture();
})();