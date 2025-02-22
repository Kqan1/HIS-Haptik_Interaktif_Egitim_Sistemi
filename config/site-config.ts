export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    metadata: {
        title: {
            default: "HİS",
            template: "%s | HİS",
        },
        description: "Ferman Desc",
        applicationName: "Ferman",
        author: [{ name: "Kqan", url: "https://github.com/Kqan1"}],
        keywords: [
            "",
        ],
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon-16x16.png",
            apple: "/apple-touch-icon.png",
        },
        category: "app",
        generator: "next.js"
    },
    links: {
        url: "http://localhost:3000",
        github: "https://github.com/Kqan1",
        // python_server: "192.168.1.165"
        python_server: "localhost",
    },
};