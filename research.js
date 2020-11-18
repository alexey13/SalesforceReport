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
 * [data-trigger-target="name"] - name of data-trigger-el. the trigger to start animation will be another element. For example All animations start when whole section appears in view
 * [data-trigger-el="name"] - this element is used as a trigger to start
 * [data-check-viewport] - set animation on pause when leave and start when element in viewport
 * [data-scroll-margin="0.2"] - number 0 - 1 set the margin from top and bottom to start animation
 * [data-counter="75"] - counter last value
 * [data-counter-postfix="%"] - postfix
 * [data-counter-duration="3"] - duration
 * [data-counter-delay="4"] - delay
 * 
 */

//Global class of animation element
var animateClass = 'animate__animated';

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
	var elements = document.querySelectorAll('[data-anime], [data-check-viewport], [data-counter], [data-trigger-el]');
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

  //Check the element in viewport. Margin number 0-1
  function isAnyPartOfElementInViewport(el, margin) {
    var rect = el.getBoundingClientRect();
    var vertInView;
    if(margin) {
    	var marginPixelsValue = windowHeight * margin;
    	vertInView = (rect.top + marginPixelsValue <= windowHeight) && ((rect.top + rect.height - marginPixelsValue) >= 0);
    } else {
    	vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    }
    
    return vertInView;
	}


	function runActions(element) {
		//Element types
    var checkViewport = element.dataset.checkViewport === '';
    var withAnime =  element.dataset.anime;
    var withCounter = element.dataset.counter;

		if(checkViewport) {
  		addViewportClass(element);
  	} 
  	if(withAnime) {
  		addClass(element);
  		if(checkViewport) {
  			removeFromList(element)
  		};
  	}
  	if(withCounter) {
  		runCounter(element);
  		removeFromList(element);
  	}
	}

	function animateElement(element) {
    
    //When start the trigger types
    var checkMargin = element.dataset.scrollMargin || '';
    var isHaveTriggerTarget = element.dataset.triggerTarget || '';
    var checkViewport = element.dataset.checkViewport === '';

    if(isHaveTriggerTarget) {
    	return;
    } else if(isAnyPartOfElementInViewport(element, checkMargin)) {

    	//As a starter for another elements
    	var isTrigger = element.dataset.triggerEl || '';

    	if(isTrigger) {
    		elements.forEach(function(el) {
    			if(el.dataset.triggerTarget && el.dataset.triggerTarget === isTrigger) {
    				runActions(el)
    			}
    		})

    	} else {
    		runActions(element)
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


window.addEventListener('load', function() {
	var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

	addAnimeParams();
	charElements();
	scrollAnimate();
	runBubbles();
	if(windowWidth > 767) {
		addMouseEvents();
	}
	addScrollSmooth();
	shareComponent();
}, false)



function addMouseEvents() {
	var elements = document.querySelectorAll('.bubbly-button, .goals-all, .js-hover__scale');
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
	
	update();
}


//Counter
function runCounter(element) {
	var finalNumber = element.dataset.counter;
	var postFix = element.dataset.counterPostfix;
	var duration = element.dataset.counterDuration || 1;
	var delay = element.dataset.counterDelay * 1000 || 0;

	var numbersArray = [];
	for (var i = 0; i <= finalNumber; i++) {
		numbersArray.push(i);
	}

	var start;
	var now;
	var then;
	var interval = (duration * 1000) / numbersArray.length;
	var delta;
	var raf;

	function update(now) {

		if (!then) { 
			then = now;
			start = now;
		}

    raf = requestAnimationFrame(update);

    if(now - start < delay) {
    	return;
    }

    delta = now - then;
    if (delta > interval) {

      then = now - (delta % interval);

      // ... Code for Drawing the Frame ...
      element.textContent = numbersArray.shift() + postFix;

      //Stop the loop
      if(!numbersArray.length) {
      	cancelAnimationFrame(raf);
      }
       
    }
	}
	
	update();
}


/*
Use the native js solution that not will wotrk and Safari. On Safari it will jump to section
[data-scrollsmooth]
<a href="#connection" class="themes__item" data-scrollsmooth></a>
<button class="themes__item" data-scrollsmooth="#connection"></button>
*/
function addScrollSmooth() {
	var elements = document.querySelectorAll('[data-scrollsmooth]');
	elements = Array.prototype.slice.call(elements);
	elements.forEach(function(el){
		el.addEventListener('click', function(e){
			e.preventDefault();
			var targetSelector = e.currentTarget.dataset.scrollsmooth || e.currentTarget.getAttribute('href');
			// Scroll to a certain element
			document.querySelector(targetSelector).scrollIntoView({ 
			  behavior: 'smooth' 
			});
		})
	})
}

/**
 * Share component
 * [data-share]
 */
function shareComponent() {
	var URL = location.href;
	var TITLE = document.title;
	var DESC = 'Learn more in a virtual forum with The Chronicle of Higher Education on December 8th, 2020';
	var url;
	
	var Share = {
		facebook: function(purl) {
			url  = 'http://www.facebook.com/sharer.php';
			url += '?u='     + encodeURIComponent(purl);
			Share.popup(url);
		},
		twitter: function(purl, ptitle) {
			url  = 'http://twitter.com/share?';
			url += 'text='      + encodeURIComponent(ptitle);
			url += '&url='      + encodeURIComponent(purl);
			url += '&counturl=' + encodeURIComponent(purl);
			Share.popup(url);
		},
		linkedin: function (purl, ptitle, text) {
      url = 'https://www.linkedin.com/shareArticle';
      url += '?mini=true';
      url += '&url=' + encodeURIComponent(purl);
      url += '&title=' + encodeURIComponent(ptitle);
      url += '&summary=' + encodeURIComponent(text);
      Share.popup(url);
    },
		popup: function(url) {
			window.open(url,'','toolbar=0,status=0,width=626,height=436');
		}
	};

	var elements = document.querySelectorAll('[data-share]');
	elements = Array.prototype.slice.call(elements);
	elements.forEach(function(el) {
		el.addEventListener('click', function(e) {
			var t = e.currentTarget.dataset.share;
			switch(t) {
				case 'facebook':
					Share.facebook(URL);
					break;
				case 'twitter':
					Share.twitter(URL, TITLE);
				case 'linkedin':
					Share.linkedin(URL, TITLE, DESC);
					break;
			}
		})
	})

}


//Helpers


//Random number
function randomInteger(min, max) {
  // Random number from min to (max+1)
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//throttle
function throttle(func, ms) {

  var isThrottled = false,
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


