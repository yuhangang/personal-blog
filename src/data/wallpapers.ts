export interface Wallpaper {
    id: string;
    title: string;
    resolution: string;
    device: string;
    src: string;
    downloadUrl: string;
}

export const wallpapers: Wallpaper[] = [
    {
        id: '1',
        title: 'Ethereal Waves',
        resolution: '4K',
        device: 'Desktop',
        src: '/wallpaper_abstract_waves.png',
        downloadUrl: '/wallpaper_abstract_waves.png',
    },
    {
        id: '2',
        title: 'Mountain Dusk',
        resolution: '4K',
        device: 'Desktop',
        src: '/wallpaper_mountain_dusk.png',
        downloadUrl: '/wallpaper_mountain_dusk.png',
    },
    // Reusing images to simulate a fuller grid
    {
        id: '3',
        title: 'Deep Ocean',
        resolution: '4K',
        device: 'Desktop',
        src: '/wallpaper_abstract_waves.png',
        downloadUrl: '/wallpaper_abstract_waves.png',
    },
    {
        id: '4',
        title: 'Serene Peaks',
        resolution: '4K',
        device: 'Desktop',
        src: '/wallpaper_mountain_dusk.png',
        downloadUrl: '/wallpaper_mountain_dusk.png',
    },
    {
        id: '5',
        title: 'Neon Flow',
        resolution: '4K',
        device: 'Desktop',
        src: '/wallpaper_abstract_waves.png',
        downloadUrl: '/wallpaper_abstract_waves.png',
    },
    {
        id: '6',
        title: 'Sunset Ridge',
        resolution: '4K',
        device: 'Desktop',
        src: '/wallpaper_mountain_dusk.png',
        downloadUrl: '/wallpaper_mountain_dusk.png',
    },
];
