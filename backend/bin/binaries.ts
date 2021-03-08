const root = './bin/'
interface Binaries {
    ffmpeg: string,
    ffprobe: string,
    ngrok: string
}
export const binPaths:{
    [os in NodeJS.Platform]?: Binaries
} = {
    linux: {
        ffmpeg: root+'linux/ffmpeg',
        ffprobe: root+'linux/ffprobe',
        ngrok: root+'linux/ngrok',
    },
    win32: {
        ffmpeg: root+'win32/ffmpeg.exe',
        ffprobe: root+'win32/ffprobe.exe',
        ngrok: root+'win32/ngrok.exe',
    }
}

export const getBinPaths = (): Binaries => {
    let platform = process.platform
    if(["linux", "win32"].includes(platform)){
        return binPaths[platform]
    }else{
        throw new Error("Platform not supported");
        process.exit();
    }
}