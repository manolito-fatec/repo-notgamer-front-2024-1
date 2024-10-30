import {Map, View} from "ol";
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import {OSM, Vector as VectorSource} from "ol/source";

export function createMap(center, zoom, projection) {
    return new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: new View({
            center: center.value,
            zoom: zoom.value,
            projection: projection.value,
        }),
    })
}
export function createNewVectorLayer(featureArray?, layername?: string, drawSource?) {
    if (drawSource) {
            return new VectorLayer({
                source: drawSource,
                properties: {layerName: layername},
        })
    } else {
    return new VectorLayer({
        source: new VectorSource({
            features: featureArray.value,
        }),
        properties: {layerName: layername},
        zIndex: 2,
    });
}}

