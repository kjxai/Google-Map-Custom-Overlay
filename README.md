# Google Map Custom Overlay
Google Map Custom Overlay is a library for building custom info overlays in Google Map. By using it, you can easily design and implement your own custom infobox on your google map section.

# Docs
Getting started with Google Map Custom Overlay is very easy. Initialize Google Map with the instructions of Google Maps official documentation page and use CustomOverlay function to display custom overlays.

## Options
latlng- Latitude and Longitude of the Custom Overlay

map- Google Map Object

Content- Overlay Content

verticalOffset- Vertical offset of the overlay

horizontalOffset- Horizontal offset of the overlay

## CSS
You can also design the Overlay with CSS.

	#google-map {
		height: 650px;
		width: 100%;
	}
	.google-map-overlay {
		position: absolute;
	}

	.google-map-overlay > .overlay-body {
	    	background: #eaeaea;
	    	border-radius: 5px;
	    	color: #fff;
	    	min-height: 70px;
	    	padding: 5px 10px;
	    	position: relative;
	    	text-align: right;
	    	width: 170px;
	    	z-index: 2;
	}

	.overlayclose {
		display: inline-block;
		padding: 2px 8px;
		width: 12px;
	}

	.google-map-overlay:hover {
		cursor: default;
	}

	.overlayclose::before,
	.overlayclose::after {
		background: #fff;
		content: '';
		display: block;
		height: 12px;
		width: 1px;
	}

	.overlayclose::before {
		-webkit-transform: rotate(50deg);
		-ms-transform: rotate(50deg);
		-o-transform: rotate(50deg);
		transform: rotate(50deg);
	}
	.overlayclose::after {
		margin-top: -12px;
		-webkit-transform: rotate(-50deg);
		-ms-transform: rotate(-50deg);
		-o-transform: rotate(-50deg);
		transform: rotate(-50deg);
	}

	.google-map-overlay .popup-corner {
		display: none;
	}

	.overlay-content {
		font-family: 'Raleway';
		font-size: 13px;
		font-weight: 300;
		text-align: center;
		text-transform: uppercase;
	}

## Javascript
	jQuery( document ).ready( function( $ ) {

		var map_opts = {
			zoom: 12,
			center: new google.maps.LatLng( 23.7104, 90.40744 ),
			sensor: 'true',
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		};

		var overlay_content = 'Hey, I am CustomOverlay. Do you want to use me?';
		var map = new google.maps.Map( document.getElementById( 'google-map' ), map_opts );
		var map_marker = new google.maps.Marker({
			position: new google.maps.LatLng( map.center.lat(), map.center.lng() ),
			map: map,
			content: '<div id="overlay-1" class="map-custom-overlay">' + overlay_content + '</div>',
		});

		google.maps.event.addListener( map_marker, "click", function ( e ) {
			if ( !$( '.google-map-overlay' ).length ) {
			var overlay = new CustomOverlay( {
				latlng: this.getPosition(),
				map: map,
				content: this.content,
				verticalOffset: -130,
				horizontalOffset: -60,
			} );			
			}		
		} );

	} );
	
# License
MIT and always will be

# Special Thanks
https://codepen.io/emgerold/
