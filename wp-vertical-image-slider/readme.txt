=== Vertical Image Slider – Responsive Thumbnail Slider with Lightbox ===
Contributors:nik00726
Donate link:http://www.i13websolution.com/donate-wordpress_image_thumbnail.php
Tags:vertical image slider,vertical thumbnail slider,responsive slider,thumbnail slider,lightbox,gutenberg block
Requires at least:3.5
Tested up to:7.1
Version:1.3.19
Stable tag:1.3.19
License:GPLv2 or later
License URI:http://www.gnu.org/licenses/gpl-2.0.html
== Description ==

A responsive vertical image slider for WordPress with a modern, dependency-free engine, a built-in lightbox, and a native Gutenberg block — or the classic jQuery-based engine for full backward compatibility. Add any number of images, set height, width, speed, and visible-image count, choose circular looping, and control whether it advances with the up/down arrows or automatically.

**Need multiple sliders, ticker/continuous scroll mode, 16 easing effects, Elementor & Divi support, or mass image upload? See [Vertical Thumbnail Slider Pro](https://www.i13websolution.com/product/wordpress-vertical-thumbnail-slider-pro-plugin/)**

**Live demo at [Vertical Image Slider](http://blog.i13websolution.com/live-preview-vertical-thumbnail-slider-pro/)**

**Please rate this plugin if you find it useful**


**=Features=**

1. Choose the Modern engine (lightweight, dependency-free, built-in lightbox, seamless circular looping) or the classic Legacy jQuery engine — full backward compatibility for existing sites.

2. Add any number of images to the slider.

3. Edit images and image names — used as the alt tag for SEO.

4. Preview your slider before adding it to a page.

5. Add it with a simple shortcode, or with the native Gutenberg block.

6. Set image height, width, and slider speed.

7. Choose up/down arrow navigation, automatic sliding, or both.

8. Circular (looping) slider option.

9. Image captions.

10. Responsive admin panel and WordPress capabilities support.


**=Pro Version Features=**

1. Unlimited sliders (multiple sliders per site).

2. Modern, dependency-free slider engine with seamless circular looping in both directions — choose per slider, alongside the classic Legacy engine.

3. Built-in modern lightbox — click any image to enlarge it, no extra plugin needed. A per-image custom link always takes priority over the lightbox.

4. True ticker/continuous scroll mode, available on both the Modern and Legacy engines.

5. 16 easing effects, with real per-frame animation on the Modern engine (not a CSS approximation) — Bounce and Elastic curves that actually bounce and spring, on both engines.

6. Native Gutenberg block: pick a slider, edit its full settings, and add or remove images straight from the Media Library, all from the block sidebar.

7. Native Elementor widget and Divi module.

8. Mass image upload and mass image order update.

9. Use the WordPress Media Uploader for image upload, from the classic admin screen or the block sidebar.

10. Add a WordPress featured image to a vertical slider directly from post/page add/edit.

11. Per-slider appearance controls: image border color, border radius, box shadow, and caption overlay.

12. No advertisements.

13. If an image description is set, it's added to the image title tag for SEO.

14. Display images according to order, or randomly.

15. Open image links in a new tab or the same tab.

16. Responsive admin panel and WordPress capabilities support.

17. Multisite compatible.

18. Priority support.



[Get Support](http://www.i13websolution.com/contacts)


== Installation ==

This plugin installs like any other WordPress plugin:

1. Upload the wp-vertical-image-slider folder to the wp-content/plugins folder.

2. Activate the plugin from the Dashboard / Plugins screen.

3. The plugin is now active — see the Usage section below to get started.

### Usage ###

1. After activating the plugin, go to Vertical Thumbnail Slider in the WordPress admin menu.

2. Manage images from the Manage Images screen.

3. Configure the slider (engine, size, speed, and more) from the Slider Setting screen.

4. Add the slider to a page or post with the native Gutenberg block, or with the shortcode: [print_vertical_thumbnail_slider]

You can also add it to a theme template with: echo do_shortcode('[print_vertical_thumbnail_slider]');


== Screenshots ==

1. Slider Setting
2. Manage Images 
3. Preview Slider
4. Pro version manage sliders
5. Pro version slider add/edit — Slider Engine, Playback, and Appearance settings
6. Pro version manage images
7. Pro version add/edit image
8. Pro version featured image add/edit
9. Responsive Slider
10. Free version Gutenberg block
11. Gutenberg block sidebar — full settings and Media Library image management (Pro)
12. Lightbox

== License ==

This plugin is free for everyone! Since it's released under the GPL, you can use it free of charge on your personal or commercial blog. But you can make some donations if you really find it useful.


== Changelog ==

= 1.3.19 =

* Changed: the "Upgrade to Pro" card now lists the full current set of Pro benefits (ticker mode, 16 easing effects, full block sidebar editing, Elementor/Divi support, appearance controls, and more) instead of the old 3-item list.

= 1.3.18 =

* Fixed: circular sliders could briefly flash the wrong (clone) content on first paint, since the initial position was never explicitly set. Free doesn't expose the Easing setting this update is otherwise about (Pro-only), so most Free installs won't notice a change from this release.

= 1.3.17 =

* Fixed: ticker/continuous mode could go blank (showing only the background color) after the browser tab was inactive and became active again. Browsers pause requestAnimationFrame while a tab is backgrounded, so the first frame afterward could report an elapsed time of minutes — jumping the scroll position by hundreds of laps in one frame. Elapsed time per frame is now capped. This only affects Ticker mode, which Free's own Settings screen doesn't expose a way to select, so it has no visible effect on a typical Free install.

= 1.3.16 =

* Internal: Modern engine now correctly handles Ticker/continuous mode when configured directly (matches the Pro version's engine, where Ticker is a selectable option); Free's own Settings screen doesn't expose a Ticker choice, so this has no visible effect on a typical Free install

= 1.3.15 =

* Fixed: the caption box (Modern engine) still rendered as an empty gray bar on images with no caption text. It's now only output when there's actual text to show.

= 1.3.14 =

* Changed: the block editor now shows a settings-summary card (engine, image count, visible count, auto, circular) instead of a live server-rendered preview — matching how this is handled across the rest of the portfolio. Live-rendering a JS-driven slider inside the editor is fragile (it doesn't lay out reliably in the editor's preview) and would mean an AJAX round trip on every sidebar change. The real slider still renders normally on the front end; the card links out to the slider settings and to the Pro upgrade page.

= 1.3.13 =

* Changed: Settings page now hides fields the Modern engine doesn't use — "Responsive Slider?" (Modern is always fluid) and "Add link to image?" (a per-image link always applies now, regardless of this toggle). Caption/Pause/Image Gap stay visible under Modern since it always uses them, rather than following the Legacy-only Responsive toggle.

= 1.3.12 =

* Changed: Modern engine images now match the Legacy engine's card look — white background, light border, subtle shadow, and a small padding gap around each image, matching the existing Legacy/responsive stylesheets.
* Changed: caption now overlays the bottom of the image (matching Legacy's responsive-mode caption bar) instead of sitting in a separate row below it.

= 1.3.11 =

* Fixed: image captions (Modern engine) were being clipped and never actually visible. The slide item's height was hard-set to just the image height, so the caption below it had no room and was cut off by the viewport's overflow clipping — along with all the position/height math, which never knew captions existed. The image itself now carries the fixed height instead of its container, so the container (and all the size calculations) naturally include the caption.
* Fixed: an image with a custom link would still open the lightbox unless "Link Images" was also checked globally. A per-image link now always takes priority over the lightbox, regardless of that setting.

= 1.3.10 =

* Fixed: the "Scroller Background" color was applied to the whole slider wrap, including the prev/next arrow rows — so the arrows sat on a solid color strip that read as a button even with no background of their own. Moved that background to just the image viewport; arrows now sit directly on the page.

= 1.3.9 =

* Changed: removed the subtle hover/focus background circle on the prev/next controls — now just the plain icon at all times (the larger invisible click area from 1.3.4 is unchanged, so it's still easy to hit).

= 1.3.8 =

* Fixed: looping past the first image using the Previous (up) arrow had a real delay/blank pause, while Next (down) was fine. The seamless-loop clone set was only appended after the real items (making forward looping seamless) — going backward past the start had no clone content to show at all until the async reset eventually caught up. Now clones a set both before and after the real items, so both directions loop seamlessly.

= 1.3.7 =

* Fixed: the first image would visibly take a moment to appear each time the loop wrapped around. The seamless loop works by cloning the image elements, and those clones had `loading="lazy"` — as a genuinely new DOM element, the browser could defer fetching it until it scrolled into view, causing a real load delay rather than an animation issue. Removed lazy-loading from slider images (a small thumbnail slider doesn't benefit from it, and the images are always near-viewport anyway).

= 1.3.6 =

* Fixed: occasional brief pause/stutter before a slide would visibly move. The instant "loop reset" snap and the next animated move happened in the same JS tick, so the browser could coalesce both style writes and start the animated move from the stale pre-reset position instead of the reset one. Now forces a reflow between the two so the reset is actually committed first.

= 1.3.5 =

* Fixed: circular mode's loop-reset timer nulled itself before actually wrapping the position, so the index just kept climbing indefinitely — after a few clicks the slider would scroll into empty space beyond the cloned content, looking like clicks stopped working. This was a regression introduced in 1.3.2's click-responsiveness fix.

= 1.3.4 =

* Fixed: prev/next click target was too small once the button chrome was removed (icon + 4px padding ≈ 24px hit area), so near-misses did nothing — now a proper 32px invisible hit area at rest, with a subtle round hover/focus highlight for discoverability
* Increased icon opacity slightly for visibility against light backgrounds

= 1.3.3 =

* Fixed: prev/next controls could still render with default browser/theme button styling in some setups — they're no longer real `<button>` elements (now a plain, keyboard-accessible control), and their CSS is hardened against theme overrides
* Note: if you still see the old button styling or delayed clicks after updating, do a hard refresh / clear any page cache — this build also carries the click-responsiveness fix from 1.3.2

= 1.3.2 =

* Fixed: Modern engine wasn't enforcing the "Visible" count — the viewport had no height, so overflow had nothing to clip and every image showed at once
* Fixed: prev/next clicks made during a circular loop-reset were dropped, making the slider feel like it responded "a few seconds late" (it was actually just reacting to the next auto-advance)
* Changed: prev/next controls are now plain icon buttons instead of full-width bars

= 1.3.1 =

* Fixed: circular/looping mode in the Modern engine now scrolls seamlessly instead of snapping back to the start
* Fixed: Preview Slider admin page not loading the Modern engine's styles/scripts
* Fixed: Upgrade-to-Pro card missing its styling on admin screens


= 1.3.0 =

* Added a modern, dependency-free slider engine (opt-in, existing sites keep the classic engine automatically)
* Added a modern lightbox for enlarging slider images on click
* Added native Gutenberg block support
* New admin menu icon
* Removed third-party affiliate ad banners, the PayPal donate button, and the Facebook like widget from the admin screens


= 1.2.19 =

* Added webp image support
* Tested with WordPress 6.8


= 1.2.18 =

* Make plugin compatible with block editor
* Tested with WordPress 6.3


= 1.2.17 =

* Fixed vulnerability
* Tested with WordPress 6.2


= 1.2.16 =

* Added Mass Image add feature
* Tested with WordPress 6.1


= 1.2.15 =

* Fixed slider touch and scroll not working properly with latest updates of WordPress

= 1.2.14 =

* Fixed slider not working in jQuery 3.x


= 1.2.13 =

* Fixed slider not working in lazy loading
* Tested with WordPress 5.5


= 1.2.12 =

* Remove jQuery.noConflict() as it cause $ problem



= 1.2.11 =

* Fixed css issue for caption
* Improve slider loading



= 1.2.10 =

* Added caption feture to responsive slider
* Fixed issue slider height
* Tested with WordPress 5.3


= 1.2.9 =

* Fixed windows os chrome browser click event not working.

= 1.2.8 =

* Fixed thumbnail links stoped working on some of latest browser like chrome.
* Fixed touch issues in smartphone
* Tested with WordPress 5.2


= 1.2.7 =

* Fixed slider move when clicking on image

= 1.2.6 =

* Fixed touch event not working in responsive vertical thumbnail slider


= 1.2.5 =

* Added wordpress capebilities feature. So that admin can set permissions

* Tested upto wordpress 5.1


= 1.2.4 =

* Improve admin UI
* Plugin now translatable
* Tested with WordPress 5.0

= 1.2.3 =

* Fixed shortcode not work in widgets of wordpress 4.8

* Tested upto wordpress 4.6

= 1.2.1 =

* I notice that some host wan't allow url in copy function php so now it is fixed.

* Now support auto slider with arrow.

* Tested upto wordpress 4.6

= 1.0 =

* Stable 1.0 first release


== Upgrade notice ==

= 1.2.11 =

* As there is css changes, Please clear browser cache as well as WP Cache( If you have any cache plugin ) after update.


= 1.2.10 =

* As there is css changes, Please clear browser cache as well as WP Cache( If you have any cache plugin ) after update.

= 1.2.8 =

*Please clear browser cache as well as WP Cache( If you have any cache plugin ) after update.


= 1.2.7 =

*Please clear browser cache as well as WP Cache( If you have any cache plugin ) after update.

= 1.2.6 =

*Please clear browser cache as well as WP Cache( If you have any cache plugin ) after update.

= 1.2.3 =

* Fixed shortcode not work in widgets of wordpress 4.8

* Tested upto wordpress 4.6

= 1.0.1 =

* Pro version please do not Upgrade here insted contact @ https://www.i13websolution.com/contacts

= 1.0 =

* Stable 1.0 first release


== Frequently asked questions ==

1. How do I use this plugin?

After activating, go to Vertical Thumbnail Slider in the admin menu, add your images, configure the slider, then add it to a page or post with the Gutenberg block or the shortcode. See the Installation section above for full steps.

2. What's the difference between the Modern and Legacy engine?

Modern is a lightweight, dependency-free engine with a built-in lightbox and seamless circular looping. Legacy is the original jQuery-based engine, kept for full backward compatibility with existing sites. Existing installs are automatically kept on Legacy after an update — nothing changes unless you switch to Modern yourself.

3. Can I have more than one slider?

The free version supports a single slider. For unlimited sliders, see Vertical Thumbnail Slider Pro.

4. Does it support continuous, non-stop (ticker) scrolling?

Ticker/continuous scroll mode is a Pro feature, available on both the Modern and Legacy engines.

5. Is there a Gutenberg block?

Yes — the free version includes a settings-summary block that links to your slider settings; the Pro version's block lets you edit full settings and manage images from the Media Library directly in the block sidebar.

6. Will this slow down my site?

The Modern engine is dependency-free (no jQuery required) and only loads its assets on pages that actually use the slider.
