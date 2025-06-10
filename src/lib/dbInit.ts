import { dbConnect } from "./db";

let initialized = false;
export async function dbInit(){
    if(initialized) return;
    await dbConnect();
    initialized = true;
}