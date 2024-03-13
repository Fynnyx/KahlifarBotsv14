import { glob } from "glob";

export async function loadFiles(dirName: string) {
    // Gets all the files in the and replace \ with / for windows
    const files = await glob(`${process.cwd()}/src/${dirName.replace(/\\/g, "/")}/**/*.{ts,js}`, {});
    // Remove the files from the cache
    files.forEach((file) => { delete require.cache[require.resolve(file)]; });
    return files;
}