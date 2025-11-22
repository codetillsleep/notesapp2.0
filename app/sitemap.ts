import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://10gpa.in",
      lastModified: new Date(),
    },
    {
      url: "https://10gpa.in/about",
      lastModified: new Date(),
    },
    {
      url: "https://10gpa.in/devlogs",
      lastModified: new Date(),
    },
  ];
}
