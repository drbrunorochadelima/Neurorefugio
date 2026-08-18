import type { Metadata, Viewport } from "next";
import { SensoryProvider } from "@/lib/sensory/context";
import { AuthProvider } from "@/lib/auth/context";
import { SENSORY_BOOTSTRAP_SCRIPT } from "@/lib/sensory/storage";
import { SkipLink } from "@/components/SkipLink";
import { NavHeader } from "@/components/NavHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AcademicFooter } from "@/components/AcademicFooter";
import { CalmButton } from "@/components/CalmButton";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "@/lib/services/register-all";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NeuroRefúgio — um espaço para existir no seu ritmo",
    template: "%s · NeuroRefúgio",
  },
  description:
    "Plataforma Corpo-Monitor: refúgio digital de baixo estímulo, autoconhecimento sensorial, games neuroinclusivos e biblioteca científica sobre neurodiversidade.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2c5b66",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SENSORY_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SensoryProvider>
          <AuthProvider>
            <SkipLink />
            <NavHeader />
            <main id="conteudo-principal" className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>
            <AcademicFooter />
            <MobileBottomNav />
            <CalmButton />
            <ServiceWorkerRegistration />
          </AuthProvider>
        </SensoryProvider>
      </body>
    </html>
  );
}
