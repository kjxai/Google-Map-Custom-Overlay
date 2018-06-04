/* 
 *  Name: Google Map CustomOverlay
 *  Version: 1.0
 *  Author: Khandaker Jim
 *  Author URI: https://github.com/Khandakerjim
 *  link: https://github.com/khandakerjim/Google-Map-Custom-Overlay

 ##   Copyright (c) 2018 - Khandaker Jim - https://github.com/khandakerjim/Google-Map-Custom-Overlay

    Permission is hereby granted, free of charge, to any person 
    obtaining a copy of this software and associated documentation 
    files (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, 
    merge, publish, distribute, sublicense, and/or sell copies of 
    the Software, and to permit persons to whom the Software is 
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall 
    be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
    DEALINGS IN THE SOFTWARE.
 */

function CustomOverlay( opts ) {
    google.maps.OverlayView.call( this );
    this.latlng_ = opts.latlng;
    this.map_ = opts.map;
    this.content = opts.content;
    this.offsetVertical_ = opts.verticalOffset;
    this.offsetHorizontal_ = opts.horizontalOffset;
    this.height_ = 105;
    this.width_ = 170;
    var me = this;
    this.boundsChangedListener_ =
        google.maps.event.addListener( this.map_, "bounds_changed", function () {
            return me.panMap.apply( me );
        });
    this.setMap( this.map_ );
};

CustomOverlay.prototype = new google.maps.OverlayView();

CustomOverlay.prototype.remove = function () {
    if ( this.div_ ) {
        this.div_.parentNode.removeChild( this.div_ );
        this.div_ = null;
    }
};

CustomOverlay.prototype.draw = function () {
    this.createElement();
    if ( !this.div_ ) return;
    var pixPosition = this.getProjection().fromLatLngToDivPixel( this.latlng_ );
    if ( !pixPosition ) return;
    this.div_.style.width = this.width_ + "px";
    this.div_.style.left = ( pixPosition.x + this.offsetHorizontal_ ) + "px";
    this.div_.style.height = this.height_ + "px";
    this.div_.style.top = ( pixPosition.y + this.offsetVertical_ ) + "px";
    this.div_.style.display = 'block';
};
CustomOverlay.prototype.createElement = function () {
    var panes = this.getPanes();
    var div = this.div_;
    if ( !div ) {
        div = this.div_ = document.createElement( 'div' );
            div.className = 'google-map-overlay';
        var contentWrapperDiv = document.createElement( 'div' );
            contentWrapperDiv.className = 'overlay-body';
        div.appendChild( contentWrapperDiv );

        var overlayClose = document.createElement( 'div' );
        overlayClose.className = 'overlayclose';
        contentWrapperDiv.appendChild( overlayClose );
        var contentDiv = document.createElement( 'div' );
        contentDiv.className = 'overlay-content';
        contentDiv.innerHTML = this.content;
        var closeBox = document.createElement( 'div' );
            closeBox.className = 'popup-corner';

        var divShape = document.createElement( 'div' );
        closeBox.appendChild( divShape );
        div.appendChild( closeBox );
        

        function removeCustomOverlay( ib ) {
            return function () {
                ib.setMap(null);
            };
        }
        google.maps.event.addDomListener( overlayClose, 'click', removeCustomOverlay(this));
        contentWrapperDiv.appendChild(contentDiv);
        div.style.display = 'none';
        panes.floatPane.appendChild(div);
        this.panMap();
    } else if (div.parentNode != panes.floatPane) {
        div.parentNode.removeChild(div);
        panes.floatPane.appendChild(div);
    } else {
    }
}

CustomOverlay.prototype.panMap = function () {

    var map = this.map_;
    var bounds = map.getBounds();
    if ( !bounds ) return;
    var position = this.latlng_;
    var iwWidth = this.width_;
    var iwHeight = this.height_;
    var iwOffsetX = this.offsetHorizontal_;
    var iwOffsetY = this.offsetVertical_;
    var padX = 0;
    var padY = 0;
    var mapDiv = map.getDiv();
    var mapWidth = mapDiv.offsetWidth;
    var mapHeight = mapDiv.offsetHeight;
    var boundsSpan = bounds.toSpan();
    var longSpan = boundsSpan.lng();
    var latSpan = boundsSpan.lat();
    var degPixelX = longSpan / mapWidth;
    var degPixelY = latSpan / mapHeight;
    var mapWestLng = bounds.getSouthWest().lng();
    var mapEastLng = bounds.getNorthEast().lng();
    var mapNorthLat = bounds.getNorthEast().lat();
    var mapSouthLat = bounds.getSouthWest().lat();
    var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
    var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
    var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
    var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
    var shiftLng =
        ( iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0 ) +
        ( iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0 );
    var shiftLat =
        ( iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0 ) +
        ( iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0 );
    var center = map.getCenter();
    var centerX = center.lng() - shiftLng;
    var centerY = center.lat() - shiftLat;
    map.setCenter(new google.maps.LatLng(centerY, centerX));
    google.maps.event.removeListener(this.boundsChangedListener_);
    this.boundsChangedListener_ = null;
};
