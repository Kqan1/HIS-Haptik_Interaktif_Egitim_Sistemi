import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "MagTouch",
        short_name: "MagTouch",
        description: "A Progressive Web App built with Next.js",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/vercel.svg",
                sizes: "192x192",
                type: "image/svg",
            },
            {
                src: "/vercel.svg",
                sizes: "512x512",
                type: "image/svg",
            },
        ],
    };
};