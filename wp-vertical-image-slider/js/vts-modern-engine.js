/*!
 * Vertical Image Slider - Modern Engine (dependency-free)
 * Handles autoplay, manual nav, circular looping, hover pause, touch swipe,
 * and ticker/continuous mode for .vts-modern-wrap instances.
 *
 * Circular mode uses a cloned-items technique so looping is a seamless,
 * continuous scroll in one direction rather than a visible snap back to the
 * start (regardless of how many images the slider has).
 */
( function () {
	'use strict';

	// Standard Penner/easings.net formulas — t is progress 0..1, returns eased
	// progress 0..1. Real per-frame math rather than a CSS transition-timing-
	// function approximation, since Bounce and Elastic genuinely can't be
	// expressed as a single cubic-bezier curve (they involve multiple
	// oscillations; cubic-bezier can only describe one smooth S-curve).
	var EASING_FUNCTIONS = {
		easeInQuad: function ( t ) { return t * t; },
		easeOutQuad: function ( t ) { return t * ( 2 - t ); },
		easeInOutQuad: function ( t ) { return t < 0.5 ? 2 * t * t : -1 + ( 4 - 2 * t ) * t; },
		easeInExpo: function ( t ) { return t === 0 ? 0 : Math.pow( 2, 10 * ( t - 1 ) ); },
		easeOutExpo: function ( t ) { return t === 1 ? 1 : 1 - Math.pow( 2, -10 * t ); },
		easeInOutExpo: function ( t ) {
			if ( t === 0 ) { return 0; }
			if ( t === 1 ) { return 1; }
			return t < 0.5 ? Math.pow( 2, 20 * t - 10 ) / 2 : ( 2 - Math.pow( 2, -20 * t + 10 ) ) / 2;
		},
		easeInBack: function ( t ) { var c1 = 1.70158, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; },
		easeOutBack: function ( t ) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow( t - 1, 3 ) + c1 * Math.pow( t - 1, 2 ); },
		easeInOutBack: function ( t ) {
			var c1 = 1.70158, c2 = c1 * 1.525;
			return t < 0.5
				? ( Math.pow( 2 * t, 2 ) * ( ( c2 + 1 ) * 2 * t - c2 ) ) / 2
				: ( Math.pow( 2 * t - 2, 2 ) * ( ( c2 + 1 ) * ( t * 2 - 2 ) + c2 ) + 2 ) / 2;
		},
		easeOutBounce: function ( t ) {
			var n1 = 7.5625, d1 = 2.75;
			if ( t < 1 / d1 ) { return n1 * t * t; }
			if ( t < 2 / d1 ) { return n1 * ( t -= 1.5 / d1 ) * t + 0.75; }
			if ( t < 2.5 / d1 ) { return n1 * ( t -= 2.25 / d1 ) * t + 0.9375; }
			return n1 * ( t -= 2.625 / d1 ) * t + 0.984375;
		},
		easeInBounce: function ( t ) { return 1 - EASING_FUNCTIONS.easeOutBounce( 1 - t ); },
		easeInOutBounce: function ( t ) {
			return t < 0.5
				? ( 1 - EASING_FUNCTIONS.easeOutBounce( 1 - 2 * t ) ) / 2
				: ( 1 + EASING_FUNCTIONS.easeOutBounce( 2 * t - 1 ) ) / 2;
		},
		easeInElastic: function ( t ) {
			var c4 = ( 2 * Math.PI ) / 3;
			return t === 0 ? 0 : t === 1 ? 1 : -Math.pow( 2, 10 * t - 10 ) * Math.sin( ( t * 10 - 10.75 ) * c4 );
		},
		easeOutElastic: function ( t ) {
			var c4 = ( 2 * Math.PI ) / 3;
			return t === 0 ? 0 : t === 1 ? 1 : Math.pow( 2, -10 * t ) * Math.sin( ( t * 10 - 0.75 ) * c4 ) + 1;
		},
		easeInOutElastic: function ( t ) {
			var c5 = ( 2 * Math.PI ) / 4.5;
			if ( t === 0 ) { return 0; }
			if ( t === 1 ) { return 1; }
			return t < 0.5
				? -( Math.pow( 2, 20 * t - 10 ) * Math.sin( ( 20 * t - 11.125 ) * c5 ) ) / 2
				: ( Math.pow( 2, -20 * t + 10 ) * Math.sin( ( 20 * t - 11.125 ) * c5 ) ) / 2 + 1;
		},
	};

	function VTSModernSlider( wrap ) {
		this.wrap = wrap;
		this.viewport = wrap.querySelector( '.vts-modern-viewport' );
		this.track = wrap.querySelector( '.vts-modern-track' );
		this.originalItems = Array.prototype.slice.call( wrap.querySelectorAll( '.vts-modern-item' ) );
		this.prevBtn = wrap.querySelector( '.vts-modern-prev' );
		this.nextBtn = wrap.querySelector( '.vts-modern-next' );

		if ( ! this.viewport || ! this.track || ! this.originalItems.length ) {
			return;
		}

		this.originalCount = this.originalItems.length;
		this.visible = Math.max( 1, parseInt( wrap.getAttribute( 'data-visible' ), 10 ) || 1 );
		this.scrollBy = Math.max( 1, parseInt( wrap.getAttribute( 'data-scroll' ), 10 ) || 1 );
		this.speed = Math.max( 100, parseInt( wrap.getAttribute( 'data-speed' ), 10 ) || 600 );
		this.pauseMs = Math.max( 300, parseInt( wrap.getAttribute( 'data-pause' ), 10 ) || 2000 );
		this.autoMode = wrap.getAttribute( 'data-auto' ); // '0' manual, '1' auto only, '2' both, '3' ticker
		this.isTicker = this.autoMode === '3';
		// A named easing curve (matching the Legacy engine's 15-curve dropdown)
		// drives the move manually via requestAnimationFrame instead of a CSS
		// transition — real per-frame easing math, not an approximation. No
		// value (the default/blank option) keeps using the existing CSS
		// transition path unchanged.
		this.easing = wrap.getAttribute( 'data-easing' ) || '';
		this.easingFn = EASING_FUNCTIONS[ this.easing ] || null;
		// Ticker mode always loops (that's the whole point) as long as there's
		// more than one item; otherwise it follows the Circular setting same
		// as before.
		this.circular = ( wrap.getAttribute( 'data-circular' ) === '1' || this.isTicker )
			&& this.originalCount > ( this.isTicker ? 1 : this.visible );
		this.pauseOnHover = wrap.getAttribute( 'data-pause-hover' ) === '1';
		this.margin = parseInt( wrap.getAttribute( 'data-margin' ), 10 ) || 0;

		this.index = 0;
		this.currentPx = 0;
		this.timer = null;
		this.resetTimer = null;
		this.tickerRaf = null;
		this.tickerLastFrame = null;
		this.easedRaf = null;

		if ( this.circular ) {
			this.cloneForSeamlessLoop();
		}

		this.applySizing();
		this.applyViewportHeight();
		this.bindEvents();

		if ( this.isTicker ) {
			this.startTicker();
		} else if ( this.autoMode === '1' || this.autoMode === '2' ) {
			this.startAuto();
		}

		// Circular sliders have a "before" clone block ahead of the real
		// content, so the real content doesn't start at the track's default
		// (untransformed) position — without this, the very first paint would
		// briefly show clone content instead of the real first item.
		this.render( false );

		wrap.style.visibility = 'visible';
	}

	// Clones a full extra set of items both before AND after the real set,
	// so scrolling in either direction past the real content always has a
	// (visually identical) clone to show, instead of running out of content.
	// The real items always sit in the middle third of the track; "index"
	// stays relative to the real set, and render() adds the offset for the
	// leading clone block when converting to a track position.
	VTSModernSlider.prototype.cloneForSeamlessLoop = function () {
		var beforeFrag = document.createDocumentFragment();
		var afterFrag = document.createDocumentFragment();
		this.originalItems.forEach( function ( item ) {
			beforeFrag.appendChild( item.cloneNode( true ) );
			afterFrag.appendChild( item.cloneNode( true ) );
		} );
		this.track.insertBefore( beforeFrag, this.track.firstChild );
		this.track.appendChild( afterFrag );
	};

	VTSModernSlider.prototype.applySizing = function () {
		var self = this;
		Array.prototype.slice.call( this.track.children ).forEach( function ( item ) {
			item.style.marginBottom = self.margin + 'px';
		} );
	};

	// The viewport has no height of its own (it just wraps a flex track), so
	// without this it grows to fit every item and "Visible" is never enforced
	// — overflow:hidden had nothing to actually clip.
	VTSModernSlider.prototype.applyViewportHeight = function () {
		var step = this.itemStep();
		var visibleCount = Math.min( this.visible, this.originalCount );
		var height = ( step * visibleCount ) - this.margin;
		this.viewport.style.height = Math.max( step, height ) + 'px';
	};

	VTSModernSlider.prototype.itemStep = function () {
		var first = this.originalItems[ 0 ];
		return first ? first.getBoundingClientRect().height + this.margin : 0;
	};

	VTSModernSlider.prototype.bindEvents = function () {
		var self = this;

		function bindNav( el, handler ) {
			if ( ! el ) {
				return;
			}
			el.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				handler();
				self.restartAutoIfNeeded();
			} );
			// The nav is a <span role="button">, not a real <button>, so it
			// needs its own keyboard activation for accessibility.
			el.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' ) {
					e.preventDefault();
					handler();
					self.restartAutoIfNeeded();
				}
			} );
		}

		bindNav( this.prevBtn, function () { self.go( -self.scrollBy ); } );
		bindNav( this.nextBtn, function () { self.go( self.scrollBy ); } );

		if ( this.pauseOnHover ) {
			this.wrap.addEventListener( 'mouseenter', function () {
				if ( self.isTicker ) {
					self.stopTicker();
				} else {
					self.stopAuto();
				}
			} );
			this.wrap.addEventListener( 'mouseleave', function () {
				if ( self.isTicker ) {
					self.startTicker();
				} else if ( self.autoMode === '1' || self.autoMode === '2' ) {
					self.startAuto();
				}
			} );
		}

		// Ticker is a non-interactive, continuously moving marquee — no
		// arrows (the server-rendered markup already omits them) and no
		// manual swipe interrupting the continuous motion.
		if ( ! this.isTicker ) {
			var touchStartY = null;
			this.viewport.addEventListener( 'touchstart', function ( e ) {
				touchStartY = e.touches[ 0 ].clientY;
			}, { passive: true } );
			this.viewport.addEventListener( 'touchend', function ( e ) {
				if ( touchStartY === null ) {
					return;
				}
				var diff = touchStartY - e.changedTouches[ 0 ].clientY;
				if ( Math.abs( diff ) > 30 ) {
					self.go( diff > 0 ? self.scrollBy : -self.scrollBy );
					self.restartAutoIfNeeded();
				}
				touchStartY = null;
			}, { passive: true } );
		}

		window.addEventListener( 'resize', function () {
			self.applyViewportHeight();
			self.render( false );
		} );
	};

	VTSModernSlider.prototype.restartAutoIfNeeded = function () {
		if ( this.autoMode === '1' || this.autoMode === '2' ) {
			this.stopAuto();
			this.startAuto();
		}
	};

	VTSModernSlider.prototype.maxIndex = function () {
		return Math.max( 0, this.originalCount - this.visible );
	};

	// If a seamless loop-reset is still pending when a new move comes in
	// (auto-advance or a click), settle it instantly (no transition, and
	// visually identical thanks to the clones) instead of ignoring the new
	// move — a dropped click made prev/next feel like it "kicked in a few
	// seconds later" once the next auto-advance eventually fired instead.
	VTSModernSlider.prototype.settlePendingReset = function () {
		if ( ! this.resetTimer ) {
			return;
		}
		window.clearTimeout( this.resetTimer );
		this.resetTimer = null;
		if ( this.index >= this.originalCount ) {
			this.index -= this.originalCount;
			this.render( false );
		} else if ( this.index < 0 ) {
			this.index += this.originalCount;
			this.render( false );
		}
	};

	VTSModernSlider.prototype.go = function ( delta ) {
		this.settlePendingReset();

		this.index += delta;

		if ( ! this.circular ) {
			var max = this.maxIndex();
			this.index = Math.min( Math.max( this.index, 0 ), max );
		}

		if ( this.easingFn ) {
			this.animateEased();
		} else {
			this.render( true );

			if ( this.circular ) {
				var self = this;
				this.resetTimer = window.setTimeout( function () {
					self.settlePendingReset();
				}, this.speed + 30 );
			}
		}
	};

	// Real per-frame eased move from the current visual position to the new
	// index, driven manually via requestAnimationFrame rather than a CSS
	// transition — the only way to get true Bounce/Elastic curves (a CSS
	// transition-timing-function can only express one smooth S-curve, not
	// multiple oscillations).
	VTSModernSlider.prototype.animateEased = function () {
		var self = this;
		var step = this.itemStep();
		var physicalIndex = this.circular ? ( this.index + this.originalCount ) : this.index;
		var toPx = step * physicalIndex;
		var fromPx = this.currentPx;
		var duration = this.speed;
		var startTime = null;
		var easeFn = this.easingFn;

		if ( this.easedRaf ) {
			window.cancelAnimationFrame( this.easedRaf );
		}
		this.track.style.transition = 'none';

		function frame( timestamp ) {
			if ( startTime === null ) {
				startTime = timestamp;
			}
			var t = Math.min( ( timestamp - startTime ) / duration, 1 );
			var px = fromPx + ( toPx - fromPx ) * easeFn( t );
			self.track.style.transform = 'translateY(-' + px + 'px)';
			self.currentPx = px;

			if ( t < 1 ) {
				self.easedRaf = window.requestAnimationFrame( frame );
			} else {
				self.easedRaf = null;
				if ( self.circular ) {
					self.resetTimer = window.setTimeout( function () {
						self.settlePendingReset();
					}, 30 );
				}
			}
		}

		this.easedRaf = window.requestAnimationFrame( frame );
	};

	VTSModernSlider.prototype.render = function ( animate ) {
		if ( this.easedRaf ) {
			// An eased animation is a frame-by-frame manual move — if a settle
			// or resize needs to render the CSS-transition way mid-flight,
			// cancel it first so the two don't fight over the transform.
			window.cancelAnimationFrame( this.easedRaf );
			this.easedRaf = null;
		}
		var step = this.itemStep();
		// In circular mode the real items sit in the middle third of the
		// track (a clone block precedes them), so the physical scroll
		// position is always offset by one full real-item count.
		var physicalIndex = this.circular ? ( this.index + this.originalCount ) : this.index;
		var px = step * physicalIndex;
		this.track.style.transition = animate ? 'transform ' + this.speed + 'ms ease' : 'none';
		this.track.style.transform = 'translateY(-' + px + 'px)';
		this.currentPx = px;
		if ( ! animate && ! this.isTicker ) {
			// Force a synchronous reflow so this instant position is actually
			// committed before anything later in the same tick re-enables the
			// transition. Without this, the browser can coalesce both style
			// writes and the next animated move starts from the stale
			// pre-reset position — which shows up as a brief pause/stutter
			// before the slide visibly moves. Skipped for ticker mode, which
			// renders every animation frame and never re-enables a
			// transition, so there's nothing to protect against here and
			// forcing a reflow every frame would only cost performance.
			void this.track.offsetHeight;
		}
	};

	VTSModernSlider.prototype.startAuto = function () {
		var self = this;
		this.stopAuto();
		this.timer = window.setInterval( function () {
			self.go( self.scrollBy );
		}, this.pauseMs );
	};

	VTSModernSlider.prototype.stopAuto = function () {
		if ( this.timer ) {
			window.clearInterval( this.timer );
			this.timer = null;
		}
	};

	// Continuous, non-stop scroll (a "ticker"/marquee) rather than discrete
	// steps — moves a fraction of an item's height every animation frame,
	// paced so one full item's height scrolls by every `speed` ms (reusing
	// the existing Speed setting so it means roughly the same thing in both
	// modes). Wrapping is checked every frame instead of via a delayed
	// settle, since continuous motion can safely subtract a full lap the
	// instant it completes with no visible seam (the clone content is
	// identical at that position).
	VTSModernSlider.prototype.startTicker = function () {
		var self = this;
		this.stopTicker();
		this.tickerLastFrame = null;

		function frame( timestamp ) {
			if ( self.tickerLastFrame === null ) {
				self.tickerLastFrame = timestamp;
			}
			var deltaMs = timestamp - self.tickerLastFrame;
			self.tickerLastFrame = timestamp;

			// Cap the elapsed time used per frame. Browsers pause
			// requestAnimationFrame entirely while a tab is backgrounded, so
			// the first frame after the tab becomes active again can report
			// an elapsed time of minutes. Without this cap, that jumps the
			// index by hundreds of laps in a single frame — scrolling the
			// track completely past all of its cloned content, which shows
			// nothing but the background color until (if ever) it lands back
			// somewhere valid.
			deltaMs = Math.min( deltaMs, 100 );

			self.index += deltaMs / self.speed;
			// A while loop rather than a single `if`: harmless when the delta
			// cap above already guarantees at most one lap per frame, but
			// keeps this correct on its own regardless of that cap or how
			// few items a slider has.
			while ( self.index >= self.originalCount ) {
				self.index -= self.originalCount;
			}
			while ( self.index < 0 ) {
				self.index += self.originalCount;
			}
			self.render( false );

			self.tickerRaf = window.requestAnimationFrame( frame );
		}

		this.tickerRaf = window.requestAnimationFrame( frame );
	};

	VTSModernSlider.prototype.stopTicker = function () {
		if ( this.tickerRaf ) {
			window.cancelAnimationFrame( this.tickerRaf );
			this.tickerRaf = null;
		}
		this.tickerLastFrame = null;
	};

	function initAll() {
		var wraps = document.querySelectorAll( '.vts-modern-wrap:not([data-vts-inited])' );
		wraps.forEach( function ( wrap ) {
			wrap.setAttribute( 'data-vts-inited', '1' );
			wrap.__vtsInstance = new VTSModernSlider( wrap );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}
	// Re-init after window load in case images shift layout (webfonts, lazy load, etc).
	window.addEventListener( 'load', function () {
		document.querySelectorAll( '.vts-modern-wrap' ).forEach( function ( wrap ) {
			var inst = wrap.__vtsInstance;
			if ( inst ) {
				inst.applyViewportHeight();
				inst.render( false );
			}
		} );
	} );
} )();
