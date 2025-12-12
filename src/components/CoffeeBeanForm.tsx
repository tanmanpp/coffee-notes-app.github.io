import { useState } from 'react';
import { ArrowLeft, Coffee, Upload, X } from 'lucide-react';
import { CoffeeBean } from '../App';

interface CoffeeBeanFormProps {
  initialData?: CoffeeBean;
  onSubmit: (bean: Omit<CoffeeBean, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function CoffeeBeanForm({ initialData, onSubmit, onCancel }: CoffeeBeanFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [origin, setOrigin] = useState(initialData?.origin || '');
  const [farm, setFarm] = useState(initialData?.farm || '');
  const [process, setProcess] = useState(initialData?.process || '');
  const [roastDate, setRoastDate] = useState(
    initialData?.roastDate
      ? new Date(initialData.roastDate).toISOString().split('T')[0]
      : ''
  );
  const [photo, setPhoto] = useState<string | undefined>(initialData?.photo);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('圖片檔案過大，請選擇小於 5MB 的圖片');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      origin,
      farm,
      process,
      roastDate,
      photo,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-amber-700" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-amber-900">
            {initialData ? '編輯咖啡豆' : '新增咖啡豆'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-amber-700 mb-2">
            名稱 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：耶加雪菲"
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            產地 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="例如：衣索比亞、哥倫比亞"
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            莊園 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={farm}
            onChange={(e) => setFarm(e.target.value)}
            placeholder="例如：耶加雪菲 沃卡村"
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            處理法 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            placeholder="例如：水洗、日曬、蜜處理"
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            烘焙日期 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={roastDate}
            onChange={(e) => setRoastDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm text-amber-700 mb-2">
            咖啡豆照片
          </label>
          
          {photo ? (
            <div className="relative inline-block">
              <img
                src={photo}
                alt="咖啡豆照片"
                className="w-full max-w-md h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors"
            >
              <Upload className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-amber-700 mb-1">點擊上傳咖啡豆照片</p>
              <p className="text-sm text-amber-500">支援 JPG、PNG 格式，檔案大小限制 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
          >
            {initialData ? '更新' : '新增'}
          </button>
        </div>
      </form>
    </div>
  );
}