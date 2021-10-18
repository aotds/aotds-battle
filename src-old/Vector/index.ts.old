import fp from 'lodash/fp';
import _ from 'lodash';

const Units = {
    degree: 360,
    arc: 12,
}

type V = [ number, number ];

export default class Vector {
    v : V;

    constructor(vector: [number,number]) {
        this.v = [ vector[0], vector[1] ];
    }

    add(vector: V): Vector {
        return new Vector(
            _.zip( this.v, vector ).map( fp.sum ) as V
        );
    }

    subtract(vector: [number,number]): Vector {
        return this.add(
            ( new Vector(vector) ).scale(-1).v
        );
    }

    scale(factor: number): Vector {
        return new Vector( this.v.map( x => factor * x ) as [ number,number] );
    }

    dot(vector: [number,number]): number {
        return fp.sum(
            _.zip( this.v, vector ).map( (v: any[]) => _.multiply(...v as V) )
        )
    }

    length(): number {
        return Math.sqrt(this.dot(this.v));
    }

    normalize(): Vector {
        return new Vector(
            this.v.map( x => x / this.length() ) as V
        );

    }

    angle(unit?: string): number {
        const a = Math.atan2(...this.v);

        if(!unit) return a;

        return a / 2 / Math.PI * Units[unit];
    }

    rotateBy(delta: number, unit?: string): Vector {
        const l = this.length();
        const a = this.angle();

        if(unit) {
            delta = delta / Units[unit] *  2 * Math.PI;
        }

        return new Vector(
            [
                Math.sin(a+delta),
                Math.cos(a+delta),
            ].map( v => v * l ) as V
        );
    }

    distance(vector: [number,number]) {
        return this.subtract(vector).length();
    }

    equal(vector: [
        number,number
    ]) {
        return !_.zip(this.v,vector).some( ([a,b]) => a !== b );
    }

}

export const V = arg => new Vector(arg);
