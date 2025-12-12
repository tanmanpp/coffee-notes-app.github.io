import { Coffee, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { CoffeeBean } from '../App';

interface CoffeeBeanListProps {
  beans: CoffeeBean[];
  onSelectBean: (id: string) => void;
  onEditBean: (bean: CoffeeBean) => void;
  onDeleteBean: (id: string) => void;
  brewRecordsCounts: { beanId: string; count: number }[];
}

export function CoffeeBeanList({
  beans,
  onSelectBean,
  onEditBean,
  onDeleteBean,
  brewRecordsCounts,
}: CoffeeBeanListProps) {
  const getBrewCount = (beanId: string) => {
    return brewRecordsCounts.find((b) => b.beanId === beanId)?.count || 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (beans.length === 0) {
    return (
      <div className="text-center py-16">
        <Coffee className="w-16 h-16 text-amber-300 mx-auto mb-4" />
        <p className="text-amber-600 mb-2">尚未新增任何咖啡豆</p>
        <p className="text-amber-500 text-sm">點擊上方按鈕開始記錄</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {beans.map((bean) => (
        <div
          key={bean.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
        >
          {bean.photo && (
            <div 
              onClick={() => onSelectBean(bean.id)}
              className="cursor-pointer"
            >
              <img
                src={bean.photo}
                alt={bean.origin}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          <div
            onClick={() => onSelectBean(bean.id)}
            className="p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {!bean.photo && (
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-amber-900 mb-1">{bean.name}</h3>
                  <p className="text-sm text-amber-600">{bean.origin} - {bean.farm}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-amber-600 mb-1">處理法</p>
                <p className="text-sm text-amber-900">{bean.process}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-amber-600 mb-1">烘焙日期</p>
                <p className="text-sm text-amber-900">{formatDate(bean.roastDate)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-600">
                {getBrewCount(bean.id)} 次沖泡記錄
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-6 py-3 bg-amber-50 border-t border-amber-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditBean(bean);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              編輯
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('確定要刪除這個咖啡豆及其所有沖泡記錄嗎？')) {
                  onDeleteBean(bean.id);
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              刪除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}