/*Local enviroment change width of parent container */
const mvpEl = document.querySelector('#mvp-article-cont .mvp-main-box');
mvpEl.style.width = 'auto';

/**
 * Animation API
 * [data-letters] - divide by words and letters phrase
 * [data-letters-anime="animate__zoomIn"] - animation class that added to letters
 * [data-letters-duration="1.4"] - set the duration of animation
 * [data-letters-delay="0.05"] - set the delay of each letter depends on formula delay*index
 * [data-anime="animate__fadeInUp"] - animation class
 * [data-anime-delay="1.1"] - animation delay
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
	var elements = document.querySelectorAll('[data-anime]');
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

  function addClass(element) {
  	var animeElement = element.dataset.anime;
  	element.classList.add(animeElement, animateClass);
    removeFromList(element)
    //On animation end remove anime attr because if parallax used it should start only after animation played
    element.addEventListener('animationend',function(){
    	element.removeAttribute('data-anime');
    	element.classList.remove(animeElement);
    })
  }

	function animateElement(element) {
    var pos                 = element.getBoundingClientRect();
    var elHeight            = pos.height;
    var elBottomFromTop     = pos.bottom;
    var elTopFromTop        = pos.top;
    var elTopFromBottom     = pos.top - windowHeight;
    var elBottomFromBottom  = pos.bottom - windowHeight;

    //Going Out
    if( elTopFromTop <= 0 && elBottomFromTop >= 0 ) { 
    	addClass(element);
    }

    //Going In
    else if( elTopFromBottom <= 0 && elBottomFromBottom >= 0 ) {
      addClass(element);
    }

    //Currently in viewport
    else if( (elTopFromTop > 0) && (elBottomFromTop < windowHeight)) {
    	addClass(element);
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
	addAnimeParams();
	charElements();
	scrollAnimate();
	parallax();
	runBubbles();
	rotateOnScroll();
}, false)




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

        	//If element has anime data return
        	if(el.dataset.anime) return;

        	//Randomizer for each element
        	var rand = randomInteger(1, 5);
        	if(rand > 3) {
        		el.style.setProperty('--bubbleX', randomInteger(-50, 50) + '%');
			  		el.style.setProperty('--bubbleY', randomInteger(-50, 50) + '%');
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



