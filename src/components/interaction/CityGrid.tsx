"use client";

import { useState } from "react";
import CityCard from "./CityCard";

const cities = [
  {
    name: "Paris",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcKE3F-KO0-LQfWKHpbuxZ95ZyvwYm18hdfL4wCBAc87gKBcNbvU2SWF30SmL2PtT_MudrqG2a5vDZa-D80lscxuAQ-nblB-gt_7hJXd2ldZj4rO7Rw-Y07lYKWIO4HFInsfN3F5b6eZOtrozbWMkMV7Rhs4dTc2J9GV9_bFO4LlGKpK5-JHH2rBBgdj2o7lRR9G0FTHphYD4wOsqQ9uq782YQO9yKrPAIZDJ44t0pLvXhOAqRhcX6TbSr6RxpC0z2DEu_85yGr2E",
  },
  {
    name: "Tokyo",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEXMqlS8GyR_eHztouobfF4_wQ7yW80XQm08lpQ-lihwSkQbYm3VJEpIaluKej1O6tgF3ZOBBB2Tb233g4Tlp61vj2jxqEL7gvF5qCR5JvwWSO0iJlAFx4V7Oe_sCIE-WKzqbQm3UOiih-d28fr9VY8kLNtVOoHgNYIwaC5fCf2IW8Si1mWXcxtBI78t14LN3tuI9vpOQOIGLis5lOsHLX3bzIREP1sXngfyVWreqt26903vhTY0ON59z05N14Bza3xrP9a-OzwJM",
  },
  {
    name: "New York",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Plvw8pS1ZPEteRW5AbLE2uMe2BCDiepBox3H80ZVa9NxwdE8YVr5xdSWYXpwopY3AvnbFv6vCy9Pk-u8ZlnZAYRe2qr4NrgA-TlgSD0gSgmKdjJlqC-V-zyzJwz68pKG0uRicBPjCygk6K8Ca5Qvyr1A5Tp0EeO86Qj2dXiBcKUTAWIc2sIUQytoNGFbEAZXs-8_louPKH4RZIShxt7iUCYJspb5UHjXVydukhsytlEwoS405TqEBFbGpqIdCHqDpSdA65sPuxM",
  },
  {
    name: "London",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCM5b98rSV7KajB_xoot2oIk_ajUQFZ3MJdNS_69YmvIPBHCk2XxEcE8H9Lk7EVD9SFqMW-lxHa519zt7yhp0oxGeIz3zlMvBPh5uowKqIsfpJknr7HJ8uYbOut53JiuoaQ3gusKVbWSlInL2UzayBRUL9qTumQ8_JSolmu_1hfWLoChDQpkoWXsm2kRrD__qJhsBMaVDZpKqYh0ja7wlC8EXwTJc84OU6ueOUQRlAtfNnUBLO_uISYTJ_hVv2jovBd22x3e2XiwaY",
  },
  {
    name: "Marrakech",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfxIw-NBS_TOGZBzTLZR36yaPzEqyG8YhT8p7XPHgMB-lqjOGHIxbXRoHg2BXXiamGuR39fEL1xqPvS0quQH6IuSyXjqEri_VwnUsRKCpxR9sVPhbcGOepcd1af2G8ffMXdqAUjqWDcj2F_BkbhoidoSApJub2h0SqIUGRqIHi1cQykH3UvOm9xs3gKXsRE0mUhyn1Ul7iFz0STg3ye90dvb9Vq3M3HhZckkSDHSFy0e-cfd5uqn9VGfmkO36Ei_j4olOXjyA73ZE",
  },
  {
    name: "Rome",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGLfGjjl-dp7XXj-upLXCAyC7KsYk066cA9-0YeRly6wOO_SJ8X8kEy0U0X9oduxW2vDMcl0Z_VkYDPE3J8wWRr6m7n0d6bdFvJ9nljNQeBAB-ovSFp3JjnWWdpjX_bbd-aSQp5YhZPdyx3HDnaLth6yBp_no4pUrmN1lVNH-vW2DLtGt9Hc0IfHrm4JwEnLEbKzmdxABMvaolF1CVmkq2yDlX3okuv9VavDm2lj6-mfSp2UjuQeccb24cgp9O7C3LavvkVFTCUug",
  },
];

export default function CityGrid() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-5xl py-4 flex-1 min-h-0 max-h-[40vh]">
      {cities.map((city) => (
        <CityCard
          key={city.name}
          name={city.name}
          imageUrl={city.imageUrl}
          selected={selected === city.name}
          onSelect={setSelected}
        />
      ))}
    </div>
  );
}
