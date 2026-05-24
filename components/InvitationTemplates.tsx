/**
 * Re-export shim untuk backward compatibility.
 * Semua template sudah dipindah ke components/templates/
 * File ini tetap ada agar import lama tidak perlu diubah.
 */
export type { InvitationProps } from "./templates/shared";
export { RSVPModal, Reveal, fadeUp, fadeIn, stagger, easeOut } from "./templates/shared";

export { EtherealGardenTemplate } from "./templates/EtherealGarden";
export { RoyalGoldTemplate } from "./templates/RoyalGold";
export { ModernCorporateTemplate } from "./templates/ModernCorporate";
export { NeonNexusTemplate } from "./templates/NeonNexus";
export { SakuraDreamTemplate } from "./templates/SakuraDream";
export { GoldenHourTemplate } from "./templates/GoldenHour";
export { MinimalIvoryTemplate } from "./templates/MinimalIvory";
export { RusticBohoTemplate } from "./templates/RusticBoho";
export { SeminarProTemplate } from "./templates/SeminarPro";
export { BirthdayPopTemplate } from "./templates/BirthdayPop";
