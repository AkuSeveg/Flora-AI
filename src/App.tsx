/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlantAnalyzer } from "./components/PlantAnalyzer";
import { GardeningChat } from "./components/GardeningChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, MessageCircle, Sprout } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_var(--tw-gradient-to)_0%,_transparent_50%)] from-green-100/40 to-emerald-100/40">
      <header className="py-8 px-6 max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full text-primary border border-primary/20">
          <Sprout className="w-6 h-6" />
          <span className="font-semibold tracking-wider uppercase text-xs">FloraGuide AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight">
          Teman Terbaik <span className="italic text-emerald-700">Kebun Anda</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground text-lg">
          Identifikasi tanaman apa pun secara instan dan dapatkan instruksi perawatan yang dipersonalisasi dari ahli berkebun bertenaga AI kami.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <Tabs defaultValue="identify" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-white/50 backdrop-blur-sm border border-primary/10 rounded-full p-1 h-14">
              <TabsTrigger 
                value="identify" 
                className="rounded-full px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Identifikasi Tanaman
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="rounded-full px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Tanya Flora
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="identify" className="mt-0 focus-visible:outline-none">
            <PlantAnalyzer />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0 focus-visible:outline-none max-w-3xl mx-auto">
            <GardeningChat />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-12 border-t border-primary/10 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary/60">
            <Sprout className="w-5 h-5" />
            <span className="font-serif font-semibold">FloraGuide</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FloraGuide AI. Menumbuhkan pengetahuan, satu tanaman setiap saat.
          </p>
          <div className="flex gap-6 text-xs uppercase tracking-widest font-semibold text-primary/40">
            <a href="#" className="hover:text-primary transition-colors">Privasi</a>
            <a href="#" className="hover:text-primary transition-colors">Ketentuan</a>
            <a href="#" className="hover:text-primary transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

