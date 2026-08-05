export type BrandId = "lylo" | "ester";

export interface BrandConfig {
  id: BrandId;
  name: string;
  logo: string;
  navLogoSize: number;
  heroBackground: string;
}

const brands: Record<BrandId, BrandConfig> = {
  lylo: {
    id: "lylo",
    name: "Lylo",
    logo: "/logo-sdp.png",
    navLogoSize: 40,
    heroBackground: "/background-lylo.png",
  },
  ester: {
    id: "ester",
    name: "Lylo",
    logo: "/logo-ester.png",
    navLogoSize: 64,
    heroBackground: "/background-ester.png",
  },
};

function resolveBrandId(): BrandId {
  const raw = process.env.NEXT_PUBLIC_BRAND;
  return raw === "ester" ? "ester" : "lylo";
}

export const activeBrand: BrandConfig = brands[resolveBrandId()];
