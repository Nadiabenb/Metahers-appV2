import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  url?: string;
  keywords?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export function SEO({ 
  title, 
  description, 
  image = "/og-image.png",
  type = "website",
  url,
  keywords,
  schema
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
    
    // Remove all existing schema scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      if (script.id?.startsWith('schema-org')) {
        script.remove();
      }
    });
    
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((schemaObj, index) => {
        const newScript = document.createElement("script");
        newScript.id = `schema-org-${index}`;
        newScript.type = "application/ld+json";
        newScript.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(newScript);
      });
    }
    
  }, [title, description, image, type, url, keywords, schema]);

  return null;
}
