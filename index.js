/*Local enviroment change width of parent container */
const mvpEl = document.querySelector('#mvp-article-cont .mvp-main-box');
if(mvpEl) {
	mvpEl.style.width = 'auto';
	mvpEl.style.margin = '0px';
}
const slfEl = document.querySelector('.page-b.contain');
if(slfEl) {
	slfEl.style.maxWidth = '100%';
	slfEl.style.borderLeft = '0';
	slfEl.style.borderRight = '0';
}

/**
 * Animation API
 * [data-letters] - divide by words and letters phrase
 * [data-letters-anime="animate__zoomIn"] - animation class that added to letters
 * [data-letters-duration="1.4"] - set the duration of animation
 * [data-letters-delay="0.05"] - set the delay of each letter depends on formula delay*index
 * [data-anime="animate__fadeInUp"] - animation class
 * [data-anime-delay="1.1"] - animation delay
 * [data-check-viewport] - set animation on pause when leave and start when element in viewport
 * 
 */

//Global class of animation element
var animateClass = 'animate__animated';
var animations = [];

//Set animation data props to letter
function setAnimationProps(el, child, index) {
	var params = ['lettersDelay', 'lettersAnime', 'lettersDuration'];
	params.forEach(function(name) {
		var param = el.dataset[name];
		if(param) {
			switch(name) {
				case 'lettersDelay' :
					child.style.setProperty('--animate-delay', param*index + 's');
					break;
				case 'lettersAnime' :
					child.dataset.anime = param;
					break;
				case 'lettersDuration' :
					child.style.setProperty('--animate-duration', param + 's');
					break;
			}
		}
	})
}


//Divide text by spans and add animation attributes;
function charElements() {
	var elements = document.querySelectorAll('[data-letters]');
	elements = Array.prototype.slice.call(elements);

	//Split each element to words and chars
	elements.forEach(function(el){
		var text = el.textContent;
		var words = text.split(" ");
		words = words.map(c => c.split(""));
		splitChar(words, el);
	})


	//Splitter
	function splitChar(words, element) {
		var frag = document.createDocumentFragment();
		var wordsLength = words.length;

		words.forEach(function(text, wordIndex){
			var e = document.createElement('span');
			e.classList.add('word');

			//Get the starter index of word letters
			var leng = 0;
			words.forEach(function(c, index) {
				if(index < wordIndex) leng += c.length;
			})

			//Split to chars
			text.forEach(function(char, index){
				var b = document.createElement('span');
				b.textContent = char;
				//Set animation data props to char
				setAnimationProps(element, b, leng + index)
				//Char added to word
				e.appendChild(b)
			})
			
			//Word added to frag
			frag.appendChild(e);
			//Add white space between words
			if(wordIndex !== wordsLength - 1) frag.appendChild(document.createTextNode(' '));
		});

		//Words frag added to element
		element.textContent = '';
		element.appendChild(frag);
	}
	
}


function addAnimeParams() {
	var elements = document.querySelectorAll('[data-anime-delay], [data-anime-duration]');
	elements = Array.prototype.slice.call(elements);

	elements.forEach(function(el) {
		var params = ['animeDelay', 'animeDuration'];
		params.forEach(function(name) {
			param = el.dataset[name];
			if(param) {
				switch(name) {
					case 'animeDelay' :
						el.style.setProperty('--animate-delay', param + 's');
						break;
					case 'animeDuration' :
						el.style.setProperty('--animate-duration', param + 's');
						break;
				}
			}
		})
	})
}


//Scroll listener
function scrollAnimate() {
	var elements = document.querySelectorAll('[data-anime], [data-check-viewport]');
	elements = Array.prototype.slice.call(elements);
	var windowWidth;
	var windowHeight;


	function onScroll() {
		elements.forEach(function(element) {
      animateElement(element);
    });
	}

	var throttledScroll = throttle(onScroll, 100);

	function onResize() {
		windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		windowWidth = (window.innerWidth || document.documentElement.clientWidth);
		onScroll()
	}


	function removeFromList(element) {
  	elements = elements.filter(function(c){
  		return c !== element;
  	});
  }

  function addViewportClass(element) {
  	element.dataset.viewport = 'true';
  }

   function removeViewportClass(element) {
  	element.dataset.viewport = 'false';
  }

  function addClass(element) {
  	var animeElement = element.dataset.anime;
  	element.classList.add(animeElement, animateClass);
    //On animation end remove anime attr because if parallax used it should start only after animation played
    //element.addEventListener('animationend', onAnimationEnd);
    //Deprecated: if you want to use several animation on one element create a separate wrapper for it
  }

  function endCallback(element) {
  	var name = element.dataset.animeOnend;

  	function callback() {
  		switch(name) {
	  		case 'remove-goals':
	  			var elements = document.querySelectorAll('.remove-goals');
	  			elements = Array.prototype.slice.call(elements);
	  			elements.forEach(function(el) {
	  				el.remove();
	  			});
	  			var ref = document.querySelector('.goals-all');
	  			ref.classList.add('animate__hover-rotate');
	  			break;
	  		case 'remove-report':
	  			var elements = document.querySelectorAll('.remove-report');
	  			elements = Array.prototype.slice.call(elements);
	  			elements.forEach(function(el) {
	  				el.remove();
	  			});
	  			document.querySelector('.report-all').style.opacity = '1';
	  	}
  	}

  	element.addEventListener('animationend', callback);
  }

  function startCallback(element) {
  	var name = element.dataset.animeOnstart;
  	var delay = element.dataset.animeDelay * 1000 || 0;

  	setTimeout(function() {
  		switch(name) {
	  		case 'remove-goals':
	  			break;
	  	}
  	}, delay)

  }

  function isAnyPartOfElementInViewport(el) {

    var rect = el.getBoundingClientRect();

    // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    var vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
	}


	function animateElement(element) {
    
    //Element types
    var checkViewport = element.dataset.checkViewport === '';
    var withAnime =  element.dataset.anime;
    var onStartCallback =  element.dataset.animeOnstart;
    var onEndCallback =  element.dataset.animeOnend;

    if(isAnyPartOfElementInViewport(element)) {
    	if(onStartCallback) {
    		startCallback(element)
    	}
    	if(onEndCallback) {
    		endCallback(element)
    	}
    	if(checkViewport) {
    		addViewportClass(element);
    	} 
    	if(withAnime) {
    		addClass(element);
    		if(!checkViewport) {
    			removeFromList(element)
    		};
    	}
    } else {
    	if(checkViewport) {
    		removeViewportClass(element)
    	}
    }
  } 

	window.addEventListener('scroll', throttledScroll, false);
	window.addEventListener('resize', onResize, false);
	onResize();

}


//On mouse move save in css variable x and y.
// [data-parallax="1"] - fastest
// [data-parallax="2"]
// [data-parallax="3"] - slowest
function parallax() {
	var x = 0;
	var y = 0;
	var targetX = 0;
	var targetY = 0;

	var el = document.querySelector('.salesforce-report');

	function onMouseMove(e) {
		x = (e.clientX / window.innerWidth - 0.5) * 2;
	  y = (e.clientY / window.innerHeight - 0.5) * 2;
	}

	function update() {
		if(x && y) {
			targetX += (x - targetX)*0.05;
  		targetY += (y - targetY)*0.05;

	  	el.style.setProperty('--x', targetX);
	  	el.style.setProperty('--y', targetY);
		}
	  requestAnimationFrame(update);
	}

	update();

	window.addEventListener('mousemove', onMouseMove);
	
}




window.addEventListener('load', function() {
	var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

	addAnimeParams();
	charElements();
	scrollAnimate();
	//parallax();
	runBubbles();
	if(windowWidth > 767) {
		rotateOnScroll();
		parallax();
		addMouseEvents();
	}
}, false)



function addMouseEvents() {
	var elements = document.querySelectorAll('.bubbly-button, .goals-all');
	elements = Array.prototype.slice.call(elements);

	elements.forEach(function(el){
		el.addEventListener('mouseenter', function(e){e.target.classList.add('animate')})
		el.addEventListener('mouseleave', function(e){e.target.classList.remove('animate')})
	})
}




//Bubble flying animation
function runBubbles() {
	var elements = document.querySelectorAll('.animation__fly');
	elements = Array.prototype.slice.call(elements);

	var now;
	var then;
	var interval = 500;
	var delta;

	function update(now) {

		if (!then) { then = now; }
    requestAnimationFrame(update);
    delta = now - then;

    if (delta > interval) {
        

        then = now - (delta % interval);

        // ... Code for Drawing the Frame ...
        elements.forEach(function(el) {
        	var isInViewport = el.dataset.viewport;
        	if(isInViewport === 'true') {
        		//Randomizer for each element
	        	var rand = randomInteger(1, 5);
	        	if(rand > 3) {
	        		el.style.setProperty('--bubbleX', randomInteger(-50, 50) + '%');
				  		el.style.setProperty('--bubbleY', randomInteger(-50, 50) + '%');
	        	}
        	}
        	

				})
    }
	}
	
	update()
}


/*Rotate on scoll*/
function rotateOnScroll() {
	var pos = 0;
	var targetPos = pos;

	var el = document.querySelector('.salesforce-report');

	var trottledOnScroll = throttle(onScroll, 100);

	function onScroll() {
		pos = window.scrollY / 5;
	}

	function update() {
		targetPos += (pos - targetPos)*0.05;
	  el.style.setProperty('--rotate', targetPos);
	  requestAnimationFrame(update);
	}	

	update();
	window.addEventListener('scroll', trottledOnScroll);
}




//Helpers


//Random number
function randomInteger(min, max) {
  // Random number from min to (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//throttle
function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}


function parallax() {
	var x, y, raf;
	var card = document.querySelector('.parallax');
	var parent = document.querySelector('.section--last');

	parent.addEventListener('mousemove', function(e) {
	  x = (e.clientX / window.innerWidth - 0.5) * 2;
	  y = (e.clientY / window.innerHeight - 0.5) * 2;

	  raf = raf || requestAnimationFrame(update);
	});

	function update() {
	  card.style.setProperty('--x', x);
	  card.style.setProperty('--y', y);
	  raf = null;
	}
}

