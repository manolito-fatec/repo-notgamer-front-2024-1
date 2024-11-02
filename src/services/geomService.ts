import type {GeometryPoint} from "@/components/Types";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import {Circle, Fill, Icon, Stroke, Style} from "ol/style";
import IconStartPin from "@/assets/IconStartPin.png";


export function makePointsFromArray(arrayOfGeomPoints: GeometryPoint[], styleColor?: string, styleIcon?: Icon): Feature {
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
            newFeatures.push(makeFeature(point, styleIcon, styleColor));
        })
    }
    return newFeatures;

}
export function  makeSinglePoint(pointObject: GeometryPoint): Point {
    return new Point(pointObject.coordinates)
}

export function makeFeature(newGeometry: Point, styleIcon?: Icon, styleColor?: string): Feature {
    let createdFeature: Feature;
    if(!styleColor && styleIcon) {
        createdFeature = new Feature({
            geometry: newGeometry
        });
        createdFeature.setStyle(new Style({image: styleIcon}))
    }
    if(!styleIcon && styleColor) {
        createdFeature = new Feature({
            geometry: newGeometry
        });
        createdFeature.setStyle(new Style({fill: styleColor}))
    }
    if(!styleIcon && !styleColor){
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