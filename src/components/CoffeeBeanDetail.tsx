import { ArrowLeft, Plus, Coffee, Trash2 } from 'lucide-react';
import { CoffeeBean, BrewRecord } from '../App';
import { BrewRecordCard } from './BrewRecordCard';

interface CoffeeBeanDetailProps {
  bean: CoffeeBean;
  brewRecords: BrewRecord[];
  onBack: () => void;
  onAddBrewRecord: () => void;
  onDeleteBrewRecord: (id: string) => void;
  onEditBrewRecord: (record: BrewRecord) => void; // ✨ 新增
}


export function CoffeeBeanDetail({
  bean,
  brewRecords,
  onBack,
  onAddBrewRecord,
  onDeleteBrewRecord,
  onEditBrewRecord,
}: CoffeeBeanDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const sortedRecords = [...brewRecords].sort(
    (a, b) => new Date(b.brewDate).getTime() - new Date(a.brewDate).getTime()
  );

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回咖啡豆列表
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        {bean.photo && (
          <img
            src={bean.photo}
            alt={bean.origin}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {!bean.photo && (
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-amber-900 mb-2">{bean.name}</h1>
                <p className="text-amber-600">{bean.origin} - {bean.farm}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 mb-1">處理法</p>
              <p className="text-amber-900">{bean.process}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 mb-1">烘焙日期</p>
              <p className="text-amber-900">{formatDate(bean.roastDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-amber-900">沖泡記錄</h2>
        <button
          onClick={onAddBrewRecord}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          新增沖泡記錄
        </button>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Coffee className="w-12 h-12 text-amber-300 mx-auto mb-4" />
          <p className="text-amber-600 mb-2">尚無沖泡記錄</p>
          <p className="text-amber-500 text-sm">點擊上方按鈕開始記錄您的沖泡體驗</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRecords.map((record) => (
            <BrewRecordCard
              key={record.id}
              record={record}
              onEdit={() => onEditBrewRecord(record)} // ✨ 編輯功能
              onDelete={() => {
                if (confirm('確定要刪除這筆沖泡記錄嗎？')) {
                  onDeleteBrewRecord(record.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}