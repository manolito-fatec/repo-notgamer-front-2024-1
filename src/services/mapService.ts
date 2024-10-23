import {Map, View} from "ol";
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import {Vector as VectorSource, XYZ} from "ol/source";

export function createMap(center, zoom, projection) {
    return new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=DxUujwebq5Zd8hO25SyJ`
                }),
            }),
        ],
        view: new View({
            center: center.value,
            zoom: zoom.value,
            projection: projection.value,
        }),
    })
}

export function createNewVectorLayer(pointFeatures) {
    return new VectorLayer({
        source: new VectorSource({
            features: pointFeatures.value,
        }),
    });
}

export function createNewVectorSource(routeLine) {
    return new VectorLayer({
        source: new VectorSource({
            features: routeLine.value,
        }),
    })
}

export function createStartLayer(pointFinalStarArrayOfFeatures) {
    return new VectorLayer({
        source: new VectorSource({
            features: pointFinalStarArrayOfFeatures.value,
        }),
        zIndex: 2,
    });
}

