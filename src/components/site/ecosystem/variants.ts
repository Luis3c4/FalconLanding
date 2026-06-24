import iphoneProOrange from "@/assets/iphoneproorangesvg.svg";
import iphoneWhite from "@/assets/iphoneprowhitesvg.svg";
import iphoneBlue from "@/assets/iphoneprobluesvg.svg";
import iphone17baserosa from "@/assets/iphone17baserosa.svg";
import iphone17baseverde from "@/assets/iphone17baseaverde.svg";
import iphone17baseazul from "@/assets/iphone17baseazul.svg";
import iphone17baseblanco from "@/assets/iphone17baseablanco.svg";
import iphone17basenegro from "@/assets/iphone17basenegro.svg";
import ipadProSilver from "@/assets/ipadprosilver.svg";
import ipadProBlack from "@/assets/ipadproblack.svg";

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
