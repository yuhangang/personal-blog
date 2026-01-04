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
        title: "Cultural Fluidity",
        desc: "Interfaces that breathe and adapt. We craft digital ecosystems that flow seamlessly across cultural boundaries.",
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
        title: "Narrative Threads",
        desc: "Every interaction weaves a story. We intertwine functionality with deep cultural resonance to build brands that matter.",
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
        title: "Global Resonance",
        desc: "Designing frequencies that amplify your vision. We build hyper-connected brands that vibrate with purpose and impact.",
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
        title: "Authentic Textures",
        desc: "Celebrating the raw grain of reality. Unpolished, genuine connections that embed your brand in cultural memory.",
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
        title: "Purpose-Led Architecture",
        desc: "Foundations built for meaningful growth. We architect systems that scale your influence and define your legacy.",
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
