import type {Coordinates, DrawedGeom, GeometryPoint} from "@/components/Types";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import {Circle, Fill, Icon, Stroke, Style} from "ol/style";
import {handleTypeError} from "@/utils/errorHandler";
import IconPositionMap from "@/assets/IconPositionMap.png";
import IconStartPin from "@/assets/IconStartPin.png";
import InconEndPin from "@/assets/IconEndPin.png";
import {ref} from "vue";
import {saveGeomData} from "@/services/apiService";



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
function convertToDrawedGeom(feature :Feature,shape :string, drawGeomName: string) :DrawedGeom| null {
    let newDrawedGeom :DrawedGeom = {};
    let newCoordinates:Coordinates[] =[];
    let newCenter : Coordinates = {};
    if(shape == 'CIRCLE'){
        newDrawedGeom.name = drawGeomName;
        newDrawedGeom.shape = shape;
        newCenter.longitude = feature.getGeometry().getCenter()[0]
        newCenter.latitude = feature.getGeometry().getCenter()[1];
        newDrawedGeom.center= {newCenter};
        newDrawedGeom.radius= feature.getGeometry().getRadius();
        return newDrawedGeom;
    } else {
        newDrawedGeom.name = drawGeomName;
        newDrawedGeom.shape = shape;
        feature.getGeometry().getCoordinates()[0].forEach(point => {
            newCoordinates.push(({longitude: point[0], latitude: point[1]}));
        })
        newDrawedGeom.coordinates = newCoordinates;
        return newDrawedGeom;
    }
}
export function saveGeoms(feature:Feature, drawGeomName: string){
    try{
        if(feature.getGeometry().getRadius()){
            saveGeomData(convertToDrawedGeom(feature,'CIRCLE',drawGeomName));
        }
    } catch (e){
        saveGeomData(convertToDrawedGeom(feature,'POLYGON',drawGeomName));
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
