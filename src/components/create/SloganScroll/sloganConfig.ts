export interface VisualParams {
    color: string;
    speed: number;
    noiseScale: number;
    amplitude: number;
    thickness: number;
    distort: number;
    type: 'fluid' | 'weave' | 'pulse' | 'noise' | 'structure' | 'dna';
}

export interface SloganItemData {
    title: string;
    desc: string;
    visual: VisualParams;
}

/*

Story
Character
Substance


*/

export const SLOGAN_ITEMS: SloganItemData[] = [
    {
        title: "Your Identity",
        desc: "We don't just build websites—we bring your brand to life. Every detail reflects who you are and what you stand for.",
        visual: {
            color: '#00f2fe',
            speed: 0.8,
            noiseScale: 0.3,
            amplitude: 2.5,
            thickness: 0.25,
            distort: 0.2,
            type: 'dna'
        }
    },
    {
        title: "Stories That Draw People In",
        desc: "Your story is your strength. We craft websites that invite visitors into your world and make them want to stay.",
        visual: {
            color: '#fee140',
            speed: 0.4,
            noiseScale: 2.0,
            amplitude: 1.5,
            thickness: 0.08,
            distort: 1.5,
            type: 'weave'
        }
    },
    {
        title: "Design That Resonates",
        desc: "More than pages—journeys. We create immersive experiences that connect on a deeper level, guiding visitors through a seamless path that doesn't just inform, but inspires.",
        visual: {
            color: '#fa709a',
            speed: 1.5,
            noiseScale: 0.5,
            amplitude: 2.0,
            thickness: 0.2,
            distort: 0.8,
            type: 'pulse'
        }
    },
    {
        title: "Stand Out From The Crowd",
        desc: "In a digital world full of noise, we ensure your presence is unmistakable. We combine bold aesthetics with singular functionality to make you impossible to ignore.",
        visual: {
            color: '#72e9f3',
            speed: 0.6,
            noiseScale: 1.2,
            amplitude: 1.8,
            thickness: 0.1,
            distort: 0.4,
            type: 'noise'
        }
    },
    {
        title: "A Foundation for Growth",
        desc: "Great websites evolve with you. We build with intention—flexible, scalable, and ready for whatever comes next.",
        visual: {
            color: '#7b7b7b',
            speed: 0.1,
            noiseScale: 0.1,
            amplitude: 0.5,
            thickness: 0.6,
            distort: 0.0,
            type: 'structure'
        }
    }
];
