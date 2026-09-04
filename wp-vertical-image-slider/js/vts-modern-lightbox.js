/*!
 * Vertical Image Slider - Modern Lightbox (dependency-free)
 * Opens full-size images in an overlay with prev/next + keyboard + Esc support.
 * Groups triggers by their closest .vts-modern-wrap / .vts-legacy-wrap so multiple
 * sliders on one page get independent galleries.
 */
( function () {
	'use strict';

	var overlay, imgEl, captionEl, prevBtn, nextBtn, closeBtn, currentGroup, currentIndex;

	function buildOverlay() {
		if ( overlay ) {
			return;
		}
		overlay = document.createElement( 'div' );
		overlay.className = 'vts-lightbox-overlay';
		overlay.setAttribute( 'role', 'dialog' );
		overlay.setAttribute( 'aria-modal', 'true' );
		overlay.innerHTML =
			'<button type="button" class="vts-lightbox-close" aria-label="Close">&times;</button>' +
			'<button type="button" class="vts-lightbox-prev" aria-label="Previous">&#8249;</button>' +
			'<div class="vts-lightbox-stage">' +
				'<img class="vts-lightbox-img" alt="" />' +
				'<div class="vts-lightbox-caption"></div>' +
			'</div>' +
			'<button type="button" class="vts-lightbox-next" aria-label="Next">&#8250;</button>';
		document.body.appendChild( overlay );

		imgEl = overlay.querySelector( '.vts-lightbox-img' );
		captionEl = overlay.querySelector( '.vts-lightbox-caption' );
		prevBtn = overlay.querySelector( '.vts-lightbox-prev' );
		nextBtn = overlay.querySelector( '.vts-lightbox-next' );
		closeBtn = overlay.querySelector( '.vts-lightbox-close' );

		closeBtn.addEventListener( 'click', close );
		overlay.addEventListener( 'click', function ( e ) {
			if ( e.target === overlay ) {
				close();
			}
		} );
		prevBtn.addEventListener( 'click', function () {
			show( currentIndex - 1 );
		} );
		nextBtn.addEventListener( 'click', function () {
			show( currentIndex + 1 );
		} );
		document.addEventListener( 'keydown', function ( e ) {
			if ( ! overlay.classList.contains( 'is-open' ) ) {
				return;
			}
			if ( e.key === 'Escape' ) {
				close();
			} else if ( e.key === 'ArrowUp' || e.key === 'ArrowLeft' ) {
				show( currentIndex - 1 );
			} else if ( e.key === 'ArrowDown' || e.key === 'ArrowRight' ) {
				show( currentIndex + 1 );
			}
		} );
	}

	function show( index ) {
		var len = currentGroup.length;
		currentIndex = ( index + len ) % len;
		var trigger = currentGroup[ currentIndex ];
		imgEl.src = trigger.getAttribute( 'data-vts-full' );
		imgEl.alt = trigger.getAttribute( 'data-vts-caption' ) || '';
		captionEl.textContent = trigger.getAttribute( 'data-vts-caption' ) || '';
		captionEl.style.display = captionEl.textContent ? '' : 'none';

		var multi = len > 1;
		prevBtn.style.display = multi ? '' : 'none';
		nextBtn.style.display = multi ? '' : 'none';
	}

	function open( group, index ) {
		buildOverlay();
		currentGroup = group;
		show( index );
		overlay.classList.add( 'is-open' );
		document.body.classList.add( 'vts-lightbox-open' );
	}

	function close() {
		if ( overlay ) {
			overlay.classList.remove( 'is-open' );
			document.body.classList.remove( 'vts-lightbox-open' );
			imgEl.src = '';
		}
	}

	function initAll() {
		var groups = {};
		var triggers = document.querySelectorAll( '.vts-lightbox-trigger' );

		triggers.forEach( function ( trigger, i ) {
			var groupWrap = trigger.closest( '[data-vts-lightbox-group]' );
			var groupId = groupWrap ? groupWrap.getAttribute( 'data-vts-lightbox-group' ) : 'default-' + i;

			if ( ! groups[ groupId ] ) {
				groups[ groupId ] = [];
			}
			groups[ groupId ].push( trigger );
		} );

		Object.keys( groups ).forEach( function ( groupId ) {
			var group = groups[ groupId ];
			group.forEach( function ( trigger, idx ) {
				trigger.addEventListener( 'click', function ( e ) {
					e.preventDefault();
					open( group, idx );
				} );
			} );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}
} )();
