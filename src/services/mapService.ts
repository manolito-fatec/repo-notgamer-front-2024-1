import {Feature, Map, View} from "ol";
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import {OSM, Vector as VectorSource, XYZ} from "ol/source";

export function createMap(center: number[], zoom: number, projection: string, darkOrWhiteMap?) {
    return new Map({
        target: 'map',
        layers: [
            new TileLayer({
                properties: {layerName: 'TileLayer'},
                source: (new XYZ({
                    url: `https://api.maptiler.com/maps/${darkOrWhiteMap}/{z}/{x}/{y}.png?key=DxUujwebq5Zd8hO25SyJ`
                }))
            }),
        ],
        view: new View({
            center: center.value,
            zoom: zoom.value,
            projection: projection.value,
        }),
    })
}
export function createNewVectorLayer(featureArray?: Feature[], layername?: string, drawSource?: VectorSource) {
    if (drawSource) {
            return new VectorLayer({
                source: drawSource,
                properties: {layerName: layername},
        })
    } else {
    return new VectorLayer({
        source: new VectorSource({
            features: featureArray,
        }),
        properties: {layerName: layername},
        zIndex: 50,
    });
}}
export function createTileLayer(layername?: string, darkOrWhiteMap?: string) {
    return new TileLayer({
        source: new XYZ({
            url: `https://api.maptiler.com/maps/${darkOrWhiteMap}/{z}/{x}/{y}.png?key=eR9oB64MlktZG90QwIJ7`
        }),
        properties: {layerName: 'TileLayer'},
    })
}

