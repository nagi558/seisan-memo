import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "精算メモ",
    short_name: "精算メモ",
    description: "立て替えた支出を記録し、相手への請求額を自動計算するシンプルな精算アプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#029e72",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
