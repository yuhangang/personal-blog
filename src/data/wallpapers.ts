export interface Wallpaper {
    id: string;
    title: string;
    resolution: string;
    device: string;
    src: string;
    downloadUrl: string;
}

import wallpaperData from './wallpapers.json';

export const wallpapers: Wallpaper[] = wallpaperData;
