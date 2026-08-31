import type { CSSProperties } from "react";
import { dark } from "@clerk/themes";

const hidden: CSSProperties = { display: "none" };

/** Profile “+ Add …” links (email, connect account, MFA, etc.). */
const profileSectionActionButton =
  "justify-self-start font-mono text-[11px] uppercase tracking-[0.12em] text-[#9f3838] hover:text-[#e7e9ee]";

const sharedVariables = {
  colorBackground: "transparent",
  colorInput: "#0a0d13",
  colorInputForeground: "#e7e9ee",
  colorForeground: "#e7e9ee",
  colorMutedForeground: "#a5adbd",
  colorNeutral: "#a5adbd",
  colorPrimary: "#9f3838",
  colorPrimaryForeground: "#e7e9ee",
  colorDanger: "#b8452f",
  colorSuccess: "#4d8a72",
  borderRadius: "4px",
  fontFamily: "var(--font-sans-stack), ui-sans-serif, system-ui, sans-serif",
  fontFamilyButtons: "var(--font-mono-stack), ui-monospace, monospace",
};

const forensicPrimaryButton =
  "h-11 w-full rounded-[4px] border border-[#9f3838]/70 bg-gradient-to-b from-[#b84545] to-[#8f3030] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#07090d] shadow-[0_0_0_1px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.42)] hover:border-[#9f3838] hover:from-[#c04a4a] hover:to-[#9f3838] hover:-translate-y-px active:scale-[0.98] transition-all";

const sharedElements = {
  userButtonPopoverCard: "border border-[#262d3b] bg-[#10141c]",
  userButtonPopoverActionButton: "text-[#a5adbd] hover:text-[#e7e9ee]",
  userButtonPopoverActionButtonText: "text-[#a5adbd]",
  userButtonPopoverFooter: "hidden",
  pricingTable: "mx-auto w-full",
  pricingTableCard:
    "overflow-hidden rounded-[6px] border border-[#262d3b] bg-[#10141c] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
  pricingTableCardTitle: "font-semibold text-[#e7e9ee]",
  pricingTableCardDescription: "text-[#a5adbd]",
  pricingTableCardFee: "font-semibold text-[#e7e9ee]",
  pricingTableCardFeature: "text-[#a5adbd]",
  pricingTableCardFooterButton: forensicPrimaryButton,
  pricingTableCardFooter: "pt-2",
};

const authFormElements = {
  rootBox: "w-full",
  cardBox: "bg-transparent shadow-none p-0 m-0 w-full",
  card: "bg-transparent shadow-none border-0 p-0 m-0 gap-6 w-full",
  main: "gap-6 p-0 w-full",
  form: "gap-5",
  formContainer: "gap-5",

  socialButtonsRoot: "w-full gap-4",
  socialButtons: "flex flex-col gap-3 w-full",
  socialButtonsIconButton:
    "h-11 min-w-0 flex-1 border border-[#262d3b] bg-[#0a0d13] text-[#e7e9ee] hover:bg-[#161b25] active:scale-[0.98] transition-colors shadow-none",
  socialButtonsBlockButton:
    "h-11 w-full border border-[#262d3b] bg-[#0a0d13] text-[#e7e9ee] hover:bg-[#161b25] active:scale-[0.98] transition-colors shadow-none",
  socialButtonsBlockButtonText:
    "font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#e7e9ee]",
  dividerLine: "bg-[#262d3b]",
  dividerText: "font-mono text-[10px] uppercase tracking-[0.14em] text-[#6f7889] px-3",
  dividerRow: "my-6 w-full",
  logoImage: hidden,
  logoGroup: hidden,
  logoGroupItem: hidden,
  header: hidden,
  headerTitle: hidden,
  headerSubtitle: hidden,
  formHeader: hidden,
  formHeaderTitle: hidden,
  formHeaderSubtitle: hidden,

  logoBox: hidden,
  formFieldLabel: "font-mono text-[10px] uppercase tracking-[0.14em] text-[#a5adbd]",
  formFieldRow: "gap-1.5",
  formFieldRow__name: "grid grid-cols-2 gap-3 max-[380px]:grid-cols-1",
  formFieldInput:
    "h-11 border border-[#262d3b] bg-[#0a0d13] text-[#e7e9ee] placeholder:text-[#6f7889] focus:border-[#9f3838]/50 shadow-none focus-within:outline-none focus-within:ring-1 focus-within:ring-[#9f3838]/35",
  formFieldInputShowPasswordButton: "text-[#a5adbd] hover:text-[#e7e9ee]",
  formButtonPrimary:
    "mt-2 h-11 w-full rounded-[4px] border border-[#9f3838]/70 bg-gradient-to-b from-[#b84545] to-[#8f3030] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#07090d] shadow-[0_0_0_1px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[#9f3838] hover:from-[#c04a4a] hover:to-[#9f3838] active:scale-[0.98] transition-all",
  formFieldErrorText: "text-[#b8452f] text-sm",
  formFieldSuccessText: "text-[#4d8a72] text-sm",

  footer: hidden,
  footerAction: hidden,
  footerActionText: hidden,
  footerActionLink: hidden,
  footerPages: hidden,
  footerPagesLink: hidden,

  identityPreviewText: "text-[#e7e9ee]",
  identityPreviewEditButton: "text-[#9f3838]",
  formResendCodeLink: "font-mono text-[11px] uppercase tracking-[0.14em] text-[#9f3838]",
  otpCodeFieldInput: "border border-[#262d3b] bg-[#0a0d13] text-[#e7e9ee]",
  alternativeMethodsBlockButton: "text-[#a5adbd] hover:text-[#e7e9ee]",
  backLink: "font-mono text-[11px] uppercase tracking-[0.14em] text-[#a5adbd] hover:text-[#e7e9ee]",
  alert: "rounded-[4px] border border-[#262d3b] bg-[#10141c]",
  alertText: "text-[#a5adbd] text-sm",
};

/** Global Clerk appearance — dark base theme + forensic overrides. */
export const clerkAppearance = {
  cssLayerName: "clerk",
  theme: dark,
  variables: {
    ...sharedVariables,
    colorBackground: "#10141c",
  },
  elements: {
    ...sharedElements,
    card: "border border-[#262d3b] shadow-none bg-[#10141c]",
    cardBox: "shadow-none",
    headerTitle: "text-[#e7e9ee] font-semibold",
    headerSubtitle: "text-[#a5adbd]",
    formFieldLabel: "text-[#a5adbd]",
    formFieldInput:
      "border border-[#262d3b] bg-[#0a0d13] text-[#e7e9ee] placeholder:text-[#6f7889] focus:border-[#9f3838]/50",
    formButtonPrimary:
      "rounded-[4px] border border-[#9f3838]/70 bg-gradient-to-b from-[#b84545] to-[#8f3030] font-semibold uppercase tracking-[0.14em] text-[11px] text-[#07090d] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[#9f3838] hover:from-[#c04a4a] hover:to-[#9f3838]",
    footerActionLink: "text-[#9f3838] hover:text-[#e7e9ee]",
  },
};

/** Account settings — navbar/header/footer hidden; AccountWorkspace owns chrome. */
export const clerkAccountAppearance = {
  cssLayerName: "clerk",
  theme: dark,
  options: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    ...sharedVariables,
    colorBackground: "transparent",
  },
  elements: {
    ...sharedElements,
    rootBox: "w-full",
    cardBox: "bg-transparent shadow-none p-0 m-0 w-full",
    card: "h-auto max-h-none overflow-visible bg-transparent shadow-none border-0 p-0 m-0 w-full gap-0",
    scrollBox: "h-auto overflow-visible border-0 bg-transparent",
    main: "gap-0 p-0 w-full",
    pageScrollBox: "p-0 w-full max-h-none overflow-visible",
    page: "w-full gap-0",
    navbar: hidden,
    navbarButtons: hidden,
    navbarButton: hidden,
    navbarMobileMenuRow: hidden,
    navbarMobileMenuButton: hidden,
    header: hidden,
    headerTitle: hidden,
    headerSubtitle: hidden,
    footer: hidden,
    footerPages: hidden,
    footerPagesLink: hidden,
    profileSection:
      "flex flex-col gap-3 border-t border-[#262d3b] py-6 first:border-t-0 first:pt-0",
    profileSectionHeader: "order-first",
    profileSectionTitle: "font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f7889]",
    profileSectionTitleText:
      "font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f7889] leading-snug",
    profileSectionSubtitle: hidden,
    profileSectionSubtitleText: hidden,
    profileSectionContent: "order-2 w-full min-w-0",
    profileSectionItemList: "w-full",
    profileSectionItem: "w-full py-3 first:pt-0 last:pb-0",
    profileSectionPrimaryButton: profileSectionActionButton,
    profileSectionButtonGroup: "flex flex-wrap items-center gap-3",
    // ActionMenu triggers (e.g. “+ Connect account”) use menuButton, not profileSectionPrimaryButton.
    menuButton__connectedAccounts: profileSectionActionButton,
    menuButton__enterpriseAccounts: profileSectionActionButton,
    menuButton__mfa: profileSectionActionButton,
    menuButton__web3Wallets: profileSectionActionButton,
    profilePageContent: "w-full",
    activeDevice: "w-full",
    activeDeviceListItem: "w-full",
    activeDeviceIcon: "text-[#a5adbd]",
    formFieldLabel: "font-mono text-[10px] uppercase tracking-[0.14em] text-[#a5adbd]",
    formFieldInput:
      "border border-[#262d3b] bg-[#0a0d13] text-[#e7e9ee] placeholder:text-[#6f7889] focus:border-[#9f3838]/50",
    formButtonPrimary:
      "bg-[#9f3838]/90 hover:bg-[#9f3838] text-[#e7e9ee] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] shadow-none",
    badge: "font-mono text-[10px] uppercase tracking-[0.1em] border border-[#262d3b] bg-[#161b25] text-[#a5adbd]",
    // Three-dot row menus only — base menuButton must stay unset so add-link variants keep red.
    menuButtonEllipsis: "text-[#a5adbd] hover:text-[#e7e9ee]",
    menuButtonEllipsisBordered: "text-[#a5adbd] hover:text-[#e7e9ee]",
    menuList: "border border-[#262d3b] bg-[#10141c]",
    menuItem: "text-[#e7e9ee] hover:bg-[#161b25]",
    accordionTriggerButton: "text-[#e7e9ee]",
    accordionContent: "text-[#a5adbd]",
  },
};

/**
 * Sign-in / sign-up — cardless, no logo, no duplicate headers.
 * AuthShell owns branding, titles, and the alternate-account link.
 */
export const clerkAuthAppearance = {
  cssLayerName: "clerk",
  theme: dark,
  options: {
    elevation: "flush" as const,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: sharedVariables,
  elements: {
    ...authFormElements,
  },
};
