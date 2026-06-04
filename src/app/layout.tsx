import type { Metadata } from "next";
import Script from "next/script";
import { Zen_Kaku_Gothic_New, Caveat } from "next/font/google";
import { AutoLatinWrap } from "@/components/AutoLatinWrap";
import { FontLoadingController } from "@/components/FontLoadingController";
import { SITE } from "@/lib/content";
import "./globals.css";

// Google Fonts (Adobe Fonts のフォールバックとしても使う)
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Adobe Fonts (Typekit) — 環境変数 NEXT_PUBLIC_TYPEKIT_KIT_ID が設定されていれば有効化
const TYPEKIT_KIT_ID = process.env.NEXT_PUBLIC_TYPEKIT_KIT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// JSON-LD: 最小構成 (Organization + WebSite)。
// 案件で Service/Product/LocalBusiness 等が必要なら追加する。
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}${SITE.logo}`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "ja-JP",
    },
  ],
};

// Adobe Fonts ローダー (Typekit の async load コード)
const TYPEKIT_LOADER = TYPEKIT_KIT_ID
  ? `(function(d) {
  var config = {
    kitId: '${TYPEKIT_KIT_ID}',
    scriptTimeout: 3000,
    async: true
  },
  h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);`
  : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Typekit が無い場合は wf-loading を付けない (splash 不要)
  const htmlClassName = `${zenKaku.variable} ${caveat.variable}${
    TYPEKIT_KIT_ID ? " wf-loading" : ""
  }`;

  return (
    <html lang="ja" className={htmlClassName} suppressHydrationWarning>
      <head>
        <noscript>
          <style>{`.font-splash{display:none!important}`}</style>
        </noscript>
        {TYPEKIT_KIT_ID && (
          <>
            <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
            <Script id="adobe-fonts" strategy="beforeInteractive">
              {TYPEKIT_LOADER!}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {TYPEKIT_KIT_ID && (
          <div className="font-splash" aria-hidden="true">
            <div className="font-splash-content">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE.logo}
                alt=""
                width={140}
                height={70}
                className="font-splash-mark"
              />
              <div className="font-splash-progress">
                <div className="font-splash-progress-track" />
                <div className="font-splash-progress-bar" />
              </div>
              <div className="font-splash-label">LOADING</div>
            </div>
          </div>
        )}
        {children}
        <AutoLatinWrap />
        {TYPEKIT_KIT_ID && <FontLoadingController />}
      </body>
    </html>
  );
}
