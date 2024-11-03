import type {DrawedGeom, GeometryPoint} from "@/components/Types";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import {Circle, Fill, Icon, Stroke, Style} from "ol/style";
import {handleTypeError} from "@/utils/errorHandler";
import {ref} from "vue";
import IconPositionMap from "@/assets/IconPositionMap.png";
import IconStartPin from "@/assets/IconStartPin.png";
import InconEndPin from "@/assets/IconEndPin.png";


export function makePointsFromArray(arrayOfGeomPoints: GeometryPoint[], pointStyle?:Style): Feature {
    let newPoints: Point[] = [];
    let newFeatures: Feature[] = [];
    if(arrayOfGeomPoints.length == 0){
        return null;
    }
    if(arrayOfGeomPoints.length == 1) {
        newPoints.push(makeSinglePoint(arrayOfGeomPoints[0]));
    }else{
        arrayOfGeomPoints.forEach(point => {
            newPoints.push(makeSinglePoint(point));
        })
        newPoints.forEach(point => {
            newFeatures.push(makeFeature(point, pointStyle));
        })
    }
    return newFeatures;

}
export function  makeSinglePoint(pointObject: GeometryPoint): Point {
    return new Point(pointObject.coordinates)
}

export function makeFeature(newGeometry: Point, pointStyle?:Style): Feature {
    let createdFeature: Feature;
    if(pointStyle) {
        createdFeature = new Feature({
            geometry: newGeometry
        });
        createdFeature.setStyle(pointStyle);
    }
    if(!pointStyle){
        createdFeature = new Feature({
            geometry: newGeometry
        });
        createdFeature.setStyle(new Style({
            image: new Circle({
                radius: 3,
                fill: new Fill({ color: 'red' }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        }));
    }
    return createdFeature;
}
export function saveGeoms(feature:Feature, drawGeomName?: string){
    let cachedGeom:DrawedGeom = ref<DrawedGeom>();
    try{
        if(feature.getGeometry().getRadius()){
            cachedGeom.name = drawGeomName.value;
            cachedGeom.radius = feature.getGeometry().getRadius();
            cachedGeom.center = feature.getGeometry().getCenter();
            console.log('Isso é um Circulo', cachedGeom);
        }
    } catch (e){
        cachedGeom.name = drawGeomName.value;
        cachedGeom.coordinates = feature.getGeometry();
        console.log('Isso é um Polígono' , cachedGeom);
        handleTypeError(e);
    }
}
export function createStartAndEndPoint(arrayOfGeometryObjects:GeometryPoint[],anguloInicial?:number){
    let pointStartStyle:Style = new Style({
        image: new Icon({
            src: IconStartPin,
            scale: 0.7,
            anchor: [0.5, 1],
        }),
    });
    let startPointIconMapStyle:Style = new Style({
        image: new Icon({
            src: IconPositionMap,
            anchor: [0.5, 0.5],
            scale: 0.2,
            rotation: anguloInicial
        }),
    });
    let endPointStyle:Style = new Style({
        image: new Icon({
            src: InconEndPin,
            scale: 0.7,
            anchor: [0.5, 1],
        }),
    })
    let startPoint:Feature = makeFeature(makeSinglePoint(arrayOfGeometryObjects[0]),pointStartStyle);
    let startPointIconMap:Feature= makeFeature(makeSinglePoint(arrayOfGeometryObjects[0]),startPointIconMapStyle);
    let endPoint:Feature = makeFeature(makeSinglePoint(arrayOfGeometryObjects[arrayOfGeometryObjects.length - 1]),endPointStyle);
    let arrayOfFeatures:Feature[] = [startPoint, endPoint,startPointIconMap];
    return arrayOfFeatures;
}
