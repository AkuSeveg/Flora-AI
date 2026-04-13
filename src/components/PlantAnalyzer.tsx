import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, Leaf, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { identifyPlant } from "@/src/lib/gemini";
import { motion, AnimatePresence } from "motion/react";

interface PlantInfo {
  commonName: string;
  scientificName: string;
  description: string;
  careInstructions: {
    watering: string;
    light: string;
    soil: string;
    temperature: string;
    humidity: string;
  };
}

export function PlantAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setPlantInfo(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(",")[1];
      const result = await identifyPlant(base64Data);
      setPlantInfo(result);
    } catch (err) {
      console.error("Analisis gagal:", err);
      setError("Gagal mengidentifikasi tanaman. Pastikan foto jelas dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-serif text-primary">Identifikasi Tanaman Anda</CardTitle>
          <CardDescription className="text-muted-foreground">
            Unggah foto atau ambil gambar untuk mendapatkan saran perawatan ahli
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6">
            {error && (
              <div className="w-full max-w-md p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center border border-destructive/20">
                {error}
              </div>
            )}
            <div 
              className="relative w-full max-w-md aspect-square rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-primary/10 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Tanaman" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-primary/60 group-hover:text-primary transition-colors">
                  <Camera className="w-12 h-12" />
                  <span className="font-medium">Klik untuk unggah atau ambil foto</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <Button 
                variant="outline" 
                className="flex-1 rounded-full border-primary/20 hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Ganti Foto
              </Button>
              <Button 
                className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                disabled={!image || loading}
                onClick={analyze}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4 mr-2" />
                    Identifikasi Tanaman
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {plantInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="md:col-span-1 border-none shadow-lg bg-white/80">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  Identifikasi
                </Badge>
                <CardTitle className="text-2xl font-serif">{plantInfo.commonName}</CardTitle>
                <CardDescription className="italic font-serif opacity-70">
                  {plantInfo.scientificName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {plantInfo.description}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-lg bg-white/80">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  Panduan Perawatan
                </Badge>
                <CardTitle className="text-2xl font-serif">Instruksi Detail</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CareItem 
                  icon={<Droplets className="text-blue-500" />} 
                  label="Penyiraman" 
                  value={plantInfo.careInstructions.watering} 
                />
                <CareItem 
                  icon={<Sun className="text-yellow-500" />} 
                  label="Cahaya" 
                  value={plantInfo.careInstructions.light} 
                />
                <CareItem 
                  icon={<Leaf className="text-green-500" />} 
                  label="Tanah" 
                  value={plantInfo.careInstructions.soil} 
                />
                <CareItem 
                  icon={<Thermometer className="text-orange-500" />} 
                  label="Suhu" 
                  value={plantInfo.careInstructions.temperature} 
                />
                <CareItem 
                  icon={<Wind className="text-cyan-500" />} 
                  label="Kelembapan" 
                  value={plantInfo.careInstructions.humidity} 
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CareItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="p-2 rounded-xl bg-muted/50 mt-1">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h4>
        <p className="text-sm leading-snug">{value}</p>
      </div>
    </div>
  );
}
