import React, { useCallback } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages, maxImages = 6 }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Fix: Explicitly type the array from FileList to File[]
      const newFiles: File[] = Array.from(e.target.files);
      const remainingSlots = maxImages - images.length;
      
      if (remainingSlots <= 0) return;

      const filesToProcess = newFiles.slice(0, remainingSlots);

      // Fix: Use Promise.all to process all files then update state once to avoid closure staleness issues
      const promises = filesToProcess.map(file => 
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        })
      );

      Promise.all(promises).then(results => {
        setImages([...images, ...results].slice(0, maxImages));
      });
    }
    // Reset value to allow re-uploading same file if deleted
    e.target.value = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, maxImages, setImages]);

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Gambar Laporan ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              <Camera size={18} />
              <span>Muat Naik Foto</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
                className="hidden"
              />
            </label>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
          <p className="text-slate-500 text-sm">Tiada gambar dimuat naik. Sila muat naik sehingga 6 gambar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
              <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-1 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};