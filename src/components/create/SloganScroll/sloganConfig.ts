export interface VisualParams {
    color: string;
    speed: number;
    noiseScale: number;
    amplitude: number;
    thickness: number;
    distort: number;
    type: 'fluid' | 'weave' | 'pulse' | 'noise' | 'structure';
}

export interface SloganItemData {
    title: string;
    desc: string;
    visual: VisualParams;
}

export const SLOGAN_ITEMS: SloganItemData[] = [
    {
        title: "Organic Fluidity",
        desc: "We prioritize natural motion over rigid grids. Our interfaces breathe, adapt, and flow like living organisms.",
        visual: {
            color: '#00f2fe',
            speed: 0.8,
            noiseScale: 0.3,
            amplitude: 2.5,
            thickness: 0.25,
            distort: 0.2,
            type: 'fluid'
        }
    },
    {
        title: "Weaving Stories",
        desc: "Every interaction is a thread in a larger tapestry. We intertwine functionality with narrative.",
        visual: {
            color: '#fee140',
            speed: 0.4,
            noiseScale: 2.0,
            amplitude: 1.5,
            thickness: 0.08, // Thin like thread
            distort: 1.5,
            type: 'weave'
        }
    },
    {
        title: "Vision & Resonance",
        desc: "Design that echoes your core values. We create digital spaces that vibrate with your brand's frequency.",
        visual: {
            color: '#fa709a',
            speed: 1.5,
            noiseScale: 0.5,
            amplitude: 2.0,
            thickness: 0.2,
            distort: 0.8,
            type: 'pulse' // Heartbeat
        }
    },
    {
        title: "Raw Material",
        desc: "Celebrating the grain of the web. Unpolished, authentic, and brutally honest experiences.",
        visual: {
            color: '#ffffff',
            speed: 0.5,
            noiseScale: 3.5,
            amplitude: 1.0,
            thickness: 0.15,
            distort: 2.5,
            type: 'noise' // Granular
        }
    },
    {
        title: "Eternal Structure",
        desc: "Foundations built to last. We architect systems that stand the test of time and scale.",
        visual: {
            color: '#7b7b7b',
            speed: 0.1,
            noiseScale: 0.1,
            amplitude: 0.5,
            thickness: 0.6, // Thick block
            distort: 0.0,
            type: 'structure'
        }
    }
];
