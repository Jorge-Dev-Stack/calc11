import { useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  defaultImage?: string;
  className?: string;
}

export default function ImageUpload({
  onChange,
  defaultImage = '/default-avatar.png',
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={twMerge('flex flex-col items-center', className)}>
      <div
        onClick={handleClick}
        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      >
        <img
          src={preview}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-sm">Change</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}