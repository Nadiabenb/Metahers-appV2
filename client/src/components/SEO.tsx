import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  url?: string;
  keywords?: string;
}

export function SEO({ 
  title, 
  description, 
  image = "/og-image.png",
  type = "website",
  url,
  keywords
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | MetaHers Mind Spa`;
    document.title = fullTitle;
    
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    updateMetaTag("description", description);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }
    
    const currentUrl = url || window.location.href;
    const imageUrl = image.startsWith("http") ? image : `${window.location.origin}${image}`;
    
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", imageUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:site_name", "MetaHers Mind Spa", true);
    
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", imageUrl);
    
  }, [title, description, image, type, url, keywords]);

  return null;
}
