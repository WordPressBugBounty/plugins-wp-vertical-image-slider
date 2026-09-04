( function ( blocks, element, blockEditor, i18n ) {
	'use strict';

	var el = element.createElement;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;

	function getSummary() {
		return ( typeof window !== 'undefined' && window.vtsBlockSummary ) ? window.vtsBlockSummary : {};
	}

	blocks.registerBlockType( 'wp-vertical-image-slider/vertical-thumbnail-slider', {
		title: __( 'Vertical Thumbnail Slider', 'wp-vertical-image-slider' ),
		description: __( 'Displays your vertical image slider (configured under Vertical Thumbnail Slider in the admin menu).', 'wp-vertical-image-slider' ),
		icon: 'image-flip-vertical',
		category: 'widgets',
		supports: {
			html: false,
		},

		edit: function () {
			var blockProps = useBlockProps();
			var summary = getSummary();

			var badges = [
				el( 'span', { key: 'engine', className: 'vts-badge ' + ( summary.engine === 'modern' ? 'vts-badge-green' : 'vts-badge-grey' ) },
					summary.engine === 'modern' ? __( 'Modern engine', 'wp-vertical-image-slider' ) : __( 'Legacy engine', 'wp-vertical-image-slider' )
				),
				el( 'span', { key: 'images', className: 'vts-badge vts-badge-blue' },
					( summary.imageCount || 0 ) + ' ' + __( 'images', 'wp-vertical-image-slider' )
				),
				el( 'span', { key: 'visible', className: 'vts-badge vts-badge-grey' },
					__( 'Visible:', 'wp-vertical-image-slider' ) + ' ' + ( summary.visible || 0 )
				),
			];

			if ( summary.auto ) {
				badges.push( el( 'span', { key: 'auto', className: 'vts-badge vts-badge-grey' }, __( 'Auto', 'wp-vertical-image-slider' ) ) );
			}
			if ( summary.circular ) {
				badges.push( el( 'span', { key: 'circular', className: 'vts-badge vts-badge-grey' }, __( 'Circular loop', 'wp-vertical-image-slider' ) ) );
			}

			return el(
				'div',
				blockProps,
				el(
					'div',
					{ className: 'vts-block-placeholder' },
					el( 'span', { className: 'dashicons dashicons-image-flip-vertical vts-block-icon' } ),
					el( 'div', { className: 'vts-block-title' }, __( 'Vertical Thumbnail Slider', 'wp-vertical-image-slider' ) ),
					el( 'div', { className: 'vts-block-badges' }, badges ),
					el( 'p', { className: 'vts-block-desc' }, __( 'Slider renders on the front end.', 'wp-vertical-image-slider' ) ),
					summary.settingsUrl
						? el( 'p', { className: 'vts-block-desc' },
							el( 'a', { href: summary.settingsUrl, target: '_blank', rel: 'noreferrer' }, __( 'Edit slider settings', 'wp-vertical-image-slider' ) )
						)
						: null,
					el( 'p', { className: 'vts-block-upsell' },
						el( 'a', { href: 'https://www.i13websolution.com/product/wordpress-vertical-thumbnail-slider-pro-plugin/', target: '_blank', rel: 'noreferrer' },
							__( 'Need multiple sliders? Upgrade to Pro →', 'wp-vertical-image-slider' )
						)
					)
				)
			);
		},

		save: function () {
			// Dynamic block: rendered server-side via render_callback.
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor,
	window.wp.i18n
);
