window.onload = init;



function init(){

    //
vu1 = new ol.View({
    center : ol.proj.transform([-8, 30], "EPSG:4326", "EPSG:3857"),
    zoom : 5
}),

//
raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

var source = new ol.source.Vector();

var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33',
      }),
    }),
  }),
});
/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
 sketch=new ol.Feature({
});

 /**
  * The help tooltip element.
  * @type {HTMLElement}
  */
 var helpTooltipElement;
 
 /**
  * Overlay to show the help messages.
  * @type {Overlay}
  */
 var helpTooltip;
 
 /**
  * The measure tooltip element.
  * @type {HTMLElement}
  */
 var measureTooltipElement;
 
 /**
  * Overlay to show the measurement.
  * @type {Overlay}
  */
 var measureTooltip;
 
 /**
  * Message to show when the user is drawing a polygon.
  * @type {string}
  */
 var continuePolygonMsg = 'Click to continue drawing the polygon';
 
 /**
  * Message to show when the user is drawing a line.
  * @type {string}
  */
 var continueLineMsg = 'Click to continue drawing the line';
 
 /**
  * Handle pointer move.
  * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
  */
 var pointerMoveHandler = function (evt) {
   if (evt.dragging) {
     return;
   }
   /** @type {string} */
   var helpMsg = 'Click to start drawing';
 
   if (sketch) {
     var geom = sketch.getGeometry();
     if (geom instanceof ol.geom.Polygon) {
       helpMsg = continuePolygonMsg;
     } else if (geom instanceof ol.geom.LineString) {
       helpMsg = continueLineMsg;
     }
   }
 
   helpTooltipElement.innerHTML = helpMsg;
   helpTooltip.setPosition(evt.coordinate);
 
   helpTooltipElement.classList.remove('hidden');
 };
//
     map= new ol.Map({
        view :  vu1,
        controls : ol.control.defaults().extend([
            new ol.control.ScaleLine(),
            new ol.control.FullScreen(),
            new ol.control.OverviewMap(),
            new ol.control.MousePosition(),
            new ol.control.ZoomSlider()

        ]), 
        layers : [
            new ol.layer.Group({
                title: 'Base Maps',
                fold : 'open',
                layers : [
                    new ol.layer.Tile({
                        title : 'OSM',
                        type: 'base',
                        visible : true,
                source : new ol.source.OSM()}),
                new ol.layer.Tile({
                  title : 'GoogleMaps',
                        type: 'base',
                        visible : true,
                  source: new ol.source.XYZ({
                    url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'
                  })
                })   
                
            ],
            }),
            new ol.layer.Group({
                title: 'Overlayers',
                fold : 'open',
                layers : [
                    new ol.layer.Tile({
                        title: 'Provinces',
                        type : 'Overlayers',
                        visible: true,
                        source : new ol.source.TileWMS({
                            url: 'http://localhost:8080/geoserver/ehtp/wms',
                            params: {
                            'LAYERS': 'Provinces',
                            'TRANSPARENT': 'true',
                            'WIDTH': 640,
                            'HEIGHT': 480,
                            'TILED': true
                                     },
                            serverType: 'geoserver',
                           // crossOrigin: 'anonymous',
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Regions',
                        type : 'Overlayers',
                        visible: true,
                        source : new ol.source.TileWMS({
                            url: 'http://localhost:8080/geoserver/ehtp/wms',
                            params: {
                            'LAYERS': 'Regions',
                            'TRANSPARENT': 'true',
                            'WIDTH': 640,
                            'HEIGHT': 480,
                            'TILED': true
                                    },
                            serverType: 'geoserver',
                           // crossOrigin: 'anonymous',
                        })
                    }),
            new ol.layer.Tile({
                title: 'nappes',
                type : 'Overlayers',
                visible: true,
                source : new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/ehtp/wms',
                    params: {
                    'LAYERS': 'nappes',
                    'TRANSPARENT': 'true',
                    'WIDTH': 640,
                    'HEIGHT': 480,
                    'TILED': true
                             },
                    serverType: 'geoserver',
                    //crossOrigin: 'anonymous',        
                })
            }),
            
        ]
    })],
        target : 'map'
    });

    // get info
    
    

    var wmsSource = new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/ehtp/wms',
        params: {
        'LAYERS': 'nappes',
        'TRANSPARENT': 'true',
        'WIDTH': 640,
        'HEIGHT': 480,
        'TILED': true
                 },
        serverType: 'geoserver',
        //crossOrigin: 'anonymous',        
    })

    var wmsSource2 = new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/ehtp/wms',
        params: {
        'LAYERS': 'Regions',
        'TRANSPARENT': 'true',
        'WIDTH': 640,
        'HEIGHT': 480,
        'TILED': true
                 },
        serverType: 'geoserver',
        //crossOrigin: 'anonymous',        
    })
    var wmsSource3 = new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/ehtp/wms',
        params: {
        'LAYERS': 'Provinces',
        'TRANSPARENT': 'true',
        'WIDTH': 640,
        'HEIGHT': 480,
        'TILED': true
                 },
        serverType: 'geoserver',
        //crossOrigin: 'anonymous',        
    })


    map.on('singleclick', function (evt) {
        document.getElementById('info').innerHTML = '';
        document.getElementById('info2').innerHTML = '';
        document.getElementById('info3').innerHTML = '';
        var viewResolution = /** @type {number} */ ( vu1.getResolution());
        var url = wmsSource.getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          'EPSG:3857',
          {'INFO_FORMAT': 'text/html'}
        );
        if (url) {
          fetch(url)
            .then(function (response) { return response.text(); })
            .then(function (html) {
              document.getElementById('info').innerHTML = html;
            });
        }
        //
        var url2 = wmsSource2.getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            'EPSG:3857',
            {'INFO_FORMAT': 'text/html'}
          );
          if (url2) {
            fetch(url2)
              .then(function (response) { return response.text(); })
              .then(function (html) {
                document.getElementById('info2').innerHTML = html;
              });
          }
          var url3 = wmsSource3.getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            'EPSG:3857',
            {'INFO_FORMAT': 'text/html'}
          );
          if (url3) {
            fetch(url3)
              .then(function (response) { return response.text(); })
              .then(function (html) {
                document.getElementById('info3').innerHTML = html;
              });
          }  
        //
      });
      
      map.on('pointermove', function (evt) {
        //pointerMoveHandler(evt);
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        var hit = map.forEachLayerAtPixel(pixel, function () {
          return true;
        });
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
      //mesure
      
//
$('.mesure-button').click(function(){
  map.on('pointermove', pointerMoveHandler);
  map.getViewport().addEventListener('mouseout', function () {
    helpTooltipElement.classList.add('hidden');
  });
  
  var typeSelect = document.getElementById('type');
  
  var draw; // global so we can remove it later
  
  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  };

  /**
* Format area output.
* @param {Polygon} polygon The polygon.
* @return {string} Formatted area.
*/
var formatArea = function (polygon) {
var area = ol.sphere.getArea(polygon);
var output;
if (area > 10000) {
output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
} else {
output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
}
return output;
};

function addInteraction() {
var type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
draw = new ol.interaction.Draw({
source: source,
type: type,
style: new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
}),
});
map.addInteraction(draw);

createMeasureTooltip();
createHelpTooltip();

var listener;
draw.on('drawstart', function (evt) {
// set sketch
sketch = evt.feature;

/** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
var tooltipCoord = evt.coordinate;

listener = sketch.getGeometry().on('change', function (evt) {
  var geom = evt.target;
  var output;
  if (geom instanceof ol.geom.Polygon) {
    output = formatArea(geom);
    tooltipCoord = geom.getInteriorPoint().getCoordinates();
  } else if (geom instanceof ol.geom.LineString) {
    output = formatLength(geom);
    tooltipCoord = geom.getLastCoordinate();
  }
  measureTooltipElement.innerHTML = output;
  measureTooltip.setPosition(tooltipCoord);
});
});

draw.on('drawend', function () {
measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
measureTooltip.setOffset([0, -7]);
// unset sketch
sketch = null;
// unset tooltip so that a new one can be created
measureTooltipElement = null;
createMeasureTooltip();
unByKey(listener);
});
}

/**
* Creates a new help tooltip
*/
function createHelpTooltip() {
if (helpTooltipElement) {
helpTooltipElement.parentNode.removeChild(helpTooltipElement);
}
helpTooltipElement = document.createElement('div');
helpTooltipElement.className = 'ol-tooltip hidden';
helpTooltip = new ol.Overlay({
element: helpTooltipElement,
offset: [15, 0],
positioning: 'center-left',
});
map.addOverlay(helpTooltip);
}
/**
* Creates a new measure tooltip
*/
function createMeasureTooltip() {
if (measureTooltipElement) {
measureTooltipElement.parentNode.removeChild(measureTooltipElement);
}
measureTooltipElement = document.createElement('div');
measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
measureTooltip = new ol.Overlay({
element: measureTooltipElement,
offset: [0, -15],
positioning: 'bottom-center',
});
map.addOverlay(measureTooltip);

}

/**
* Let user change the geometry type.
*/
typeSelect.onchange = function () {
map.removeInteraction(draw);
addInteraction();
};

addInteraction();
});


    
    //print
    $(document).ready(function () {
      //your code here
      $('.print-button').click(function(){
        window.print();
      })
    })
    
    

    var layerSwitcher = new ol.control.LayerSwitcher({});
    map.addControl(layerSwitcher);
}
//mesure
