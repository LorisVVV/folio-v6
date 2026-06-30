"use server"

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ShapefileData, SHPParser } from '@/utils/SHPParser';
import { SHPLoader } from '@/utils/SHPParser/three';
import { GLTFExporter, OBJExporter } from "three/examples/jsm/Addons.js"
import { Group, Object3DEventMap } from "three";


export async function shpToJSON(src:string, output:string, spherize:boolean = false): Promise<string> {


    const model = await shpToModel(src, spherize)

    // to JSON
    const modelJSON = model.toJSON()

    // Write file
    const jsonPathname =  path.join(process.cwd(), output);
    writeFileSync(jsonPathname, JSON.stringify(modelJSON))
    return JSON.stringify(modelJSON)
}

export async function shpToGLFT(src:string, output:string, spherize:boolean = false): Promise<boolean> {
    const modelPathname =  path.join(process.cwd(), output);


    try {
        console.log("Parsing data...");
        const model = await shpToModel(src, spherize)
        const exporter = new GLTFExporter();
        await exporter.parse(model, (result) => {
            if (result instanceof ArrayBuffer) {
                writeFileSync(modelPathname, Buffer.from(result))
            }
        }, (err) => {
            console.log(err);
        });
        console.log("Data parsed !");
    } catch (e) {
        console.error(e);
        
    }

    
    return true
}
export async function shpToOBJ(src:string, output:string, spherize:boolean = false): Promise<boolean> {
    const modelPathname =  path.join(process.cwd(), output);


    try {
        console.log("Parsing data...");
        const model = await shpToModel(src, spherize)

        const exporter = new OBJExporter();


        const result = await exporter.parse(model)

        writeFileSync(modelPathname, result)
        
        console.log("Data parsed !");
    } catch (e) {
        console.error(e);
        
    }

    
    return true
}

async function shpToModel(src:string, spherize:boolean = false): Promise<Group<Object3DEventMap>> {
    // Load shp as ShapeFileData
    const shapeFileData = await load(src)

    // Load ShapeFileData into 3D Object
    const loader = new SHPLoader();
    const model = loader.createModel(shapeFileData, { spherize: spherize });
    return model
}


async function load(src: string): Promise<ShapefileData> {
    // const response = await fetch(src);
    const filePath = path.join(process.cwd(), src);

    try {
        const fileBuffer = readFileSync(filePath)
        return new SHPParser().parse(SHPParser.toArrayBuffer(fileBuffer))
    } catch (e) {
        throw new Error(`Failed to load shapefile: ${e}`);
    }
}

function toArrayBuffer(buffer:NonSharedBuffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}