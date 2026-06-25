import iphoneProOrange from "@/assets/iphoneproorangesvg.svg";
import iphoneWhite from "@/assets/iphoneprowhitesvg.webp";
import iphoneBlue from "@/assets/iphoneprobluesvg.webp";
import iphone17baserosa from "@/assets/iphone17baserosa.webp";
import iphone17baseverde from "@/assets/iphone17baseaverde.webp";
import iphone17baseazul from "@/assets/iphone17baseazul.webp";
import iphone17baseblanco from "@/assets/iphone17baseablanco.webp";
import iphone17basenegro from "@/assets/iphone17basenegro.webp";
import ipadProSilver from "@/assets/ipadprosilver.webp";
import ipadProBlack from "@/assets/ipadproblack.webp";
import ipadairblack from "@/assets/ipadairblack.webp";
import ipadairblue from "@/assets/ipadairblue.webp";
import ipadairpurple from "@/assets/ipadairpurple.webp";
import ipadairstarlight from "@/assets/ipadairstarlight.webp";

export type Variant = {
    id: string;
    image: string;
    swatch: string;
};

export const proVariants: Variant[] = [
    {
        id: "orange",
        image: iphoneProOrange,
        swatch: "bg-orange-500",
    },
    {
        id: "white",
        image: iphoneWhite,
        swatch: "bg-zinc-100",
    },
    {
        id: "blue",
        image: iphoneBlue,
        swatch: "bg-[#46527C]",
    },
];

export const baseVariants: Variant[] = [
    {
        id: "levanda",
        image: iphone17baserosa,
        swatch: "bg-[#EEE3F3]",
    },
    {
        id: "sage",
        image: iphone17baseverde,
        swatch: "bg-[#A9B689]",
    },
    {
        id: "blue",
        image: iphone17baseazul,
        swatch: "bg-[#ABC0DE]",
    },
    {
        id: "white",
        image: iphone17baseblanco,
        swatch: "bg-zinc-100",
    },
    {
        id: "black",
        image: iphone17basenegro,
        swatch: "bg-[#484C4F]",
    },
];

export const iPadsProVariants: Variant[] = [
    {
        id: "silver",
        image: ipadProSilver,
        swatch: "bg-silver-500",
    },
    {
        id: "black",
        image: ipadProBlack,
        swatch: "bg-[#484C4F]",
    },
];

export const iPadAirVariants: Variant[] = [
    {
        id: "blue",
        image: ipadairblue,
        swatch: "bg-[#D7E5E6]",
    },
    {
        id: "black",
        image: ipadairblack,
        swatch: "bg-[#6B696E]",
    },
    {
        id: "purple",
        image: ipadairpurple,
        swatch: "bg-[#E3DEE9]",
    },
    {
        id: "starlight",
        image: ipadairstarlight,
        swatch: "bg-[#E3DCD1]",
    },
];
