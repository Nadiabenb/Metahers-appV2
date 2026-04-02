// MetaHers Image Manifest - Violet Sanctuary Assets
// Maps slugs to generated image filenames for hero, spaces, blog, and achievements

import heroSanctuaryImage from "@assets/hero-ai-web3-woman_1762876953575.jpg";
import web3SpaceImage from "@assets/generated_images/Web3_blockchain_woman_tech_18d40367.png";
import aiSpaceImage from "@assets/generated_images/AI_neural_network_woman_7b5da9b3.png";
import nftSpaceImage from "@assets/generated_images/NFT_digital_art_woman_c4093fda.png";
import metaverseSpaceImage from "@assets/generated_images/Metaverse_virtual_world_woman_989cc16d.png";
import brandingSpaceImage from "@assets/generated_images/Personal_branding_woman_tech_03a081e8.png";
import momsSpaceImage from "@assets/generated_images/Tech_mom_entrepreneur_balance_14af09c8.png";
import appAtelierSpaceImage from "@assets/generated_images/App_building_woman_designer_72d3791d.png";
import founderClubSpaceImage from "@assets/generated_images/Founder_startup_woman_CEO_582afaaf.png";
import digitalBoutiqueSpaceImage from "@assets/generated_images/Digital_boutique_e-commerce_woman_c3bd40e7.png";

import aiCodingBlogImage from "@assets/generated_images/AI_coding_woman_blog_b7411e06.png";
import web3SpeakerBlogImage from "@assets/generated_images/Web3_speaker_woman_blog_4b3c9e3d.png";
import entrepreneurBlogImage from "@assets/generated_images/Entrepreneur_analytics_woman_blog_3d994b12.png";
import metaverseBlogImage from "@assets/generated_images/Metaverse_VR_woman_blog_c35fd417.png";
import contentCreatorBlogImage from "@assets/generated_images/Content_creator_brand_woman_823b264b.png";

import achievementStarImage from "@assets/generated_images/Achievement_star_purple_gradient_351afb25.png";
import achievementCrownImage from "@assets/generated_images/Crown_achievement_violet_badge_e32249d8.png";
import achievementDiamondImage from "@assets/generated_images/Diamond_gem_purple_certificate_905c1047.png";

export const heroImage = {
  src: heroSanctuaryImage,
  alt: "Woman in gold dress presenting AI and Web3 with holographic blockchain interface on purple background - MetaHers",
};

// Map space slugs to cover images (4:3 aspect ratio)
export const spaceImages: Record<string, { src: string; alt: string }> = {
  "web3": {
    src: web3SpaceImage,
    alt: "Woman interacting with blockchain and Web3 holographic interfaces",
  },
  "ai": {
    src: aiSpaceImage,
    alt: "Woman surrounded by AI neural network visualizations and machine learning interfaces",
  },
  "crypto": {
    src: nftSpaceImage,
    alt: "Woman holding glowing NFT digital art in luxury virtual gallery",
  },
  "metaverse": {
    src: metaverseSpaceImage,
    alt: "Woman exploring futuristic metaverse environment with virtual reality portals",
  },
  "branding": {
    src: brandingSpaceImage,
    alt: "Woman with personal branding elements and digital brand visualizations",
  },
  "moms": {
    src: momsSpaceImage,
    alt: "Mother balancing entrepreneurship and family with holographic work-life visualizations",
  },
  "app-atelier": {
    src: appAtelierSpaceImage,
    alt: "Woman building holographic app interfaces with AI-powered no-code tools",
  },
  "founders-club": {
    src: founderClubSpaceImage,
    alt: "Woman entrepreneur presenting startup pitch with holographic growth charts",
  },
  "digital-boutique": {
    src: digitalBoutiqueSpaceImage,
    alt: "Woman entrepreneur with e-commerce product displays and online store interfaces",
  },
};

// Blog article header images (16:9 aspect ratio)
export const blogImages = {
  aiCoding: {
    src: aiCodingBlogImage,
    alt: "Woman working with AI coding interfaces in luxury tech workspace",
  },
  web3Speaker: {
    src: web3SpeakerBlogImage,
    alt: "Woman presenting Web3 and blockchain concepts with holographic visualizations",
  },
  entrepreneur: {
    src: entrepreneurBlogImage,
    alt: "Woman entrepreneur with digital analytics and e-commerce growth charts",
  },
  metaverse: {
    src: metaverseBlogImage,
    alt: "Woman exploring metaverse and virtual reality environments",
  },
  contentCreator: {
    src: contentCreatorBlogImage,
    alt: "Woman building personal brand with social media and content creation tools",
  },
};

// Achievement badge backgrounds (1:1 aspect ratio)
export const achievementImages = {
  star: {
    src: achievementStarImage,
    alt: "Purple gradient achievement star badge",
  },
  crown: {
    src: achievementCrownImage,
    alt: "Violet crown achievement badge with neon glow",
  },
  diamond: {
    src: achievementDiamondImage,
    alt: "Purple diamond certificate background with jewel-toned gradient",
  },
};
