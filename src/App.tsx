import { useState, useEffect } from 'react';
import { Plus, GitCompare } from 'lucide-react';
import { CoffeeBeanList } from './components/CoffeeBeanList';
import { CoffeeBeanDetail } from './components/CoffeeBeanDetail';
import { CoffeeBeanForm } from './components/CoffeeBeanForm';
import { BrewRecordForm } from './components/BrewRecordForm';
import { BrewRecordComparison } from './components/BrewRecordComparison';
import { NotesWidget } from "./components/NotesWidget";
import { supabase } from '../lib/supabase';
import { LoginScreen } from "../screens/LoginScreen";



export interface CoffeeBean {
  id: string;
  name: string;
  origin: string;
  farm: string;
  process: string;
  roastDate: string;
  createdAt: string;
  photo?: string; // Base64 encoded image
}

export interface FlavorProfile {
  // 味覺指標
  sour: number;      // 酸
  sweet: number;     // 甜
  bitter: number;    // 苦
  body: number;      // 醇度
  // 香氣指標
  citrus: number;    // 酸甜
  honey: number;     // 蜜甜
  driedFruit: number; // 果乾
  caramel: number;   // 焦糖
  nutty: number;     // 堅果
  
  roasted: number;   // 炭香
  spice: number;     // 香料
  herbal: number;    // 草本味
}

export interface BrewRecord {
  id: string;
  coffeeBeanId: string;
  dripper: string;
  grinder: string;
  grindSetting: string;
  waterTemp: number;
  brewTime: string;
  flavorProfile: FlavorProfile;
  notes: string;
  brewDate: string;
}

export interface Note {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}


export default function App() {
  // 1️⃣ 所有 state hooks 一次宣告好
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [brewRecords, setBrewRecords] = useState<BrewRecord[]>([]);
  const [selectedBeanId, setSelectedBeanId] = useState<string | null>(null);
  const [showBeanForm, setShowBeanForm] = useState(false);
  const [showBrewForm, setShowBrewForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [editingBean, setEditingBean] = useState<CoffeeBean | null>(null);
  const [session, setSession] = useState<any>(null);
  const [editingBrewRecord, setEditingBrewRecord] = useState<BrewRecord | null>(null);


  //目前登入使用者的 id
  const userId = session?.user?.id as string | undefined;

  const emptyFlavorProfile: FlavorProfile = {
    sour: 0,
    sweet: 0,
    bitter: 0,
    body: 0,
    citrus: 0,
    honey: 0,
    driedFruit: 0,
    caramel: 0,
    nutty: 0,
    roasted: 0,
    spice: 0,
    herbal: 0,
  };


  // Supabase flavor_records 資料列型別
  type DBFlavorRecordRow = {
    id: string;
    user_id: string;
    coffee_bean_id: string;
    dripper: string | null;
    grinder: string | null;
    grind_setting: string | null;
    water_temp: number | null;
    brew_time: string | null;
    notes: string | null;
    brew_date: string | null;
    flavor_profile: any | null;   // 實際會是 FlavorProfile
    created_at: string | null;
  };


  // 2️⃣ 所有 useEffect 也都要在函式一開始就宣告完，不要放在 return 或 if 之後

  // Supabase session 檢查
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // 從 localStorage 載入資料
  useEffect(() => {
    const savedBeans = localStorage.getItem("coffeeBeans");
    const savedRecords = localStorage.getItem("brewRecords");

    if (savedBeans) {
      setCoffeeBeans(JSON.parse(savedBeans));
    }
    if (savedRecords) {
      setBrewRecords(JSON.parse(savedRecords));
    }
  }, []);

  // 儲存 coffeeBeans 到 localStorage
  useEffect(() => {
    if (coffeeBeans.length > 0 || localStorage.getItem("coffeeBeans")) {
      localStorage.setItem("coffeeBeans", JSON.stringify(coffeeBeans));
    }
  }, [coffeeBeans]);

  // 儲存 brewRecords 到 localStorage
  useEffect(() => {
    if (brewRecords.length > 0 || localStorage.getItem("brewRecords")) {
      localStorage.setItem("brewRecords", JSON.stringify(brewRecords));
    }
  }, [brewRecords]);


  // Supabase coffee_beans 資料列型別（可以不 export，只在 App 裡用）
  type DBCoffeeBeanRow = {
    id: string;
    user_id: string;
    name: string | null;
    origin: string | null;
    farm: string | null;
    process: string | null;
    roastDate: string | null;  // date 這裡先用 string 接
    photo: string | null;
    created_at: string | null;
  };

  // 前端 CoffeeBean -> 上傳到 Supabase 的 row
  function toDBCoffeeBeanRow(bean: CoffeeBean, userId: string): DBCoffeeBeanRow {
    return {
      id: bean.id,                // uuid，由前端產生或 DB 產生
      user_id: userId,
      name: bean.name || null,
      origin: bean.origin || null,
      farm: bean.farm || null,
      process: bean.process || null,
      roastDate: bean.roastDate || null,
      photo: bean.photo ?? null,
      created_at: bean.createdAt || null,
    };
  }

  // Supabase row -> 前端 CoffeeBean
  function fromDBCoffeeBeanRow(row: DBCoffeeBeanRow): CoffeeBean {
    return {
      id: row.id,
      name: row.name ?? "",
      origin: row.origin ?? "",
      farm: row.farm ?? "",
      process: row.process ?? "",
      roastDate: row.roastDate ?? "",
      createdAt: row.created_at ?? new Date().toISOString(),
      photo: row.photo ?? undefined,
    };
  }

  function mergeById<T extends { id: string }>(local: T[], remote: T[]): T[] {
    const map = new Map<string, T>();

    // 先放 local：保留本機資料
    for (const item of local) {
      map.set(item.id, item);
    }

    // 再放 remote：同 id 會以雲端為準
    for (const item of remote) {
      map.set(item.id, item);
    }

    return Array.from(map.values());
  }

  //新增的localStorage同步 Supabase資料庫
  const uploadToCloud = async () => {
    if (!userId) {
      alert("尚未登入，無法上傳雲端資料");
      return;
    }

    try {
      // 1. 上傳豆子：cofee_beans（有就更新，沒有就新增）
      if (coffeeBeans.length > 0) {
        const beansPayload = coffeeBeans.map((b) => ({
          ...b,
          user_id: userId, // ⚠ 確保 table 有 user_id 欄位
        }));

        const { error: insBeanErr } = await supabase
          .from("coffee_beans") // ✅ 這裡用你現在的表名
          .upsert(beansPayload, {
            onConflict: "id", // 以 id 當 key 合併
          });

        if (insBeanErr) throw insBeanErr;
      }
  // 2. 上傳沖泡紀錄 flavor_records
      if (brewRecords.length > 0) {
        const recordsPayload = brewRecords.map((r) =>
          toDBFlavorRecordRow(r, userId)
        );

        const { error: recError } = await supabase
          .from("flavor_records")   // ⚠️ 表名如果不一樣，改這裡
          .upsert(recordsPayload, {
            onConflict: "id",
          });

        if (recError) throw recError;
      }

      alert("豆子與沖泡紀錄已合併上傳到雲端！");
    } catch (err: any) {
      console.error("上傳雲端失敗", err);
      alert("上傳雲端失敗：" + (err?.message ?? "未知錯誤"));
    }
  };

  // 從 Supabase 下載資料，覆蓋目前畫面 + localStorage
  const downloadFromCloud = async () => {
    if (!userId) {
      alert("尚未登入，無法從雲端載入資料");
      return;
    }

    try {
      // 1. 先抓 coffee_beans
      const { data: beansData, error: beansError } = await supabase
        .from("coffee_beans")
        .select("*")
        .eq("user_id", userId)
        .order("createdAt", { ascending: true });

      if (beansError) throw beansError;

      const remoteBeans = (beansData ?? []).map((row) =>
        fromDBCoffeeBeanRow(row as DBCoffeeBeanRow)
      );
      const mergedBeans = mergeById(coffeeBeans, remoteBeans);
      setCoffeeBeans(mergedBeans);
      localStorage.setItem("coffeeBeans", JSON.stringify(mergedBeans));

      // 2. 再抓 flavor_records
      const { data: recData, error: recError } = await supabase
        .from("flavor_records")
        .select("*")
        .eq("user_id", userId)
        .order("brew_date", { ascending: true });

      if (recError) throw recError;

      const remoteRecords = (recData ?? []).map((row) =>
        fromDBFlavorRecordRow(row as DBFlavorRecordRow)
      );
      const mergedRecords = mergeById(brewRecords, remoteRecords);
      setBrewRecords(mergedRecords);
      localStorage.setItem("brewRecords", JSON.stringify(mergedRecords));

      alert("已從雲端合併豆子與沖泡紀錄到本機");
    } catch (err: any) {
      console.error("下載雲端資料失敗", err);
      alert("下載雲端資料失敗：" + (err?.message ?? "未知錯誤"));
    }
  };

  // 前端 BrewRecord -> Supabase flavor_records row
  function toDBFlavorRecordRow(
    rec: BrewRecord,
    userId: string
  ): DBFlavorRecordRow {
    return {
      id: rec.id,                        // uuid（下面會確保新增時用 uuid）
      user_id: userId,
      coffee_bean_id: rec.coffeeBeanId,  // 對應 coffee_beans.id
      dripper: rec.dripper || null,
      grinder: rec.grinder || null,
      grind_setting: rec.grindSetting || null,
      water_temp: rec.waterTemp ?? null,
      brew_time: rec.brewTime || null,
      notes: rec.notes || null,
      brew_date: rec.brewDate || null,
      flavor_profile: rec.flavorProfile ?? emptyFlavorProfile,
      created_at: null, // 讓 DB 自己填 now() 也可以
    };
  }

  // Supabase row -> 前端 BrewRecord
  function fromDBFlavorRecordRow(row: DBFlavorRecordRow): BrewRecord {
    return {
      id: row.id,
      coffeeBeanId: row.coffee_bean_id,
      dripper: row.dripper ?? "",
      grinder: row.grinder ?? "",
      grindSetting: row.grind_setting ?? "",
      waterTemp: row.water_temp ?? 0,
      brewTime: row.brew_time ?? "",
      notes: row.notes ?? "",
      brewDate: row.brew_date ?? row.created_at ?? new Date().toISOString(),
      flavorProfile: (row.flavor_profile as FlavorProfile) ?? emptyFlavorProfile,
    };
  }

  // 3️⃣ hooks 全部宣告完之後，這裡才做「登入狀態判斷」
  if (!session) {
    return <LoginScreen onLogin={() => {}} />;
  }

  // 4️⃣ 底下才是各種 handler & JSX，這些不影響 hooks 順序，可以自由放

  const handleAddBean = (bean: Omit<CoffeeBean, "id" | "createdAt">) => {
    const newBean: CoffeeBean = {
      ...bean,
      id: crypto.randomUUID(),
      createdAt:new Date().toISOString(),
    };
    setCoffeeBeans([...coffeeBeans, newBean]);
    setShowBeanForm(false);
  };

  const handleUpdateBean = (bean: Omit<CoffeeBean, "id" | "createdAt">) => {
    if (editingBean) {
      setCoffeeBeans(
        coffeeBeans.map((b) =>
          b.id === editingBean.id
            ? { ...bean, id: editingBean.id, createdAt: editingBean.createdAt }
            : b
        )
      );
      setEditingBean(null);
      setShowBeanForm(false);
    }
  };

  const handleDeleteBean = (id: string) => {
    setCoffeeBeans(coffeeBeans.filter((b) => b.id !== id));
    setBrewRecords(brewRecords.filter((r) => r.coffeeBeanId !== id));
    setSelectedBeanId(null);
  };

  const handleAddBrewRecord = (
    record: Omit<BrewRecord, "id" | "coffeeBeanId" | "brewDate">
  ) => {
    if (selectedBeanId) {
      const newRecord: BrewRecord = {
        ...record,
        id: crypto.randomUUID(),
        coffeeBeanId: selectedBeanId,
        brewDate: new Date().toISOString(),
      };
      setBrewRecords([...brewRecords, newRecord]);
      setShowBrewForm(false);
    }
  };

  const handleUpdateBrewRecord = (
    data: Omit<BrewRecord, "id" | "coffeeBeanId" | "brewDate">
  ) => {
    if (!editingBrewRecord) return;

    const updated: BrewRecord = {
      ...editingBrewRecord,
      ...data, // 用表單的內容覆蓋原本的 dripper / grinder / flavorProfile 等
    };

    setBrewRecords((prev) =>
      prev.map((r) => (r.id === editingBrewRecord.id ? updated : r))
    );

    setEditingBrewRecord(null);
    setShowBrewForm(false);
  };


  const handleDeleteBrewRecord = (id: string) => {
    setBrewRecords(brewRecords.filter((r) => r.id !== id));
  };

  const selectedBean = coffeeBeans.find((b) => b.id === selectedBeanId);
  const beanBrewRecords = brewRecords.filter(
    (r) => r.coffeeBeanId === selectedBeanId
  );

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        {showComparison ? (
          <div className="max-w-6xl mx-auto p-6">
            <BrewRecordComparison
              brewRecords={brewRecords}
              coffeeBeans={coffeeBeans}
              onBack={() => setShowComparison(false)}
            />
          </div>
        ) : !selectedBeanId && !showBeanForm ? (
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-amber-900 mb-2">手沖咖啡記錄</h1>
                <p className="text-amber-700">記錄您的咖啡豆與沖泡體驗</p>
              </div>
              <div  className="flex flex-col items-end gap-2">
                {/* 第一排：雲端同步 */}
                <div className="flex gap-3">
                  <button
                    onClick={downloadFromCloud}
                    className="px-3 py-1 text-sm border border-amber-500 text-amber-700 rounded-lg hover:bg-amber-50 shadow-md"
                  >
                    從雲端載入
                  </button>
                  <button
                    onClick={uploadToCloud}
                    className="px-3 py-1 text-sm border border-amber-500 text-amber-700 rounded-lg hover:bg-amber-50 shadow-md"
                  >
                    上傳到雲端
                  </button>
                </div>
                {/* 第二排：新增咖啡豆 & 比較記錄 */}
                <div className="flex gap-3">
                  {brewRecords.length >= 2 && (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <GitCompare className="w-5 h-5" />
                      比較記錄
                    </button>
                  )}
                  <button
                    onClick={() => setShowBeanForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                    新增咖啡豆
                  </button>
                </div>
              </div>
            </div>

            <CoffeeBeanList
              beans={coffeeBeans}
              onSelectBean={setSelectedBeanId}
              onEditBean={(bean) => {
                setEditingBean(bean);
                setShowBeanForm(true);
              }}
              onDeleteBean={handleDeleteBean}
              brewRecordsCounts={coffeeBeans.map((bean) => ({
                beanId: bean.id,
                count: brewRecords.filter(
                  (r) => r.coffeeBeanId === bean.id
                ).length,
              }))}
            />
          </div>
        ) : showBeanForm ? (
          <div className="max-w-2xl mx-auto p-6">
            <CoffeeBeanForm
              initialData={editingBean || undefined}
              onSubmit={editingBean ? handleUpdateBean : handleAddBean}
              onCancel={() => {
                setShowBeanForm(false);
                setEditingBean(null);
              }}
            />
          </div>
        ) : selectedBean && !showBrewForm ? (
          <div className="max-w-4xl mx-auto p-6">
            <CoffeeBeanDetail
              bean={selectedBean}
              brewRecords={beanBrewRecords}
              onBack={() => setSelectedBeanId(null)}
              onAddBrewRecord={() => {
                setEditingBrewRecord(null);      // 新增模式
                setShowBrewForm(true);
              }}
              onDeleteBrewRecord={handleDeleteBrewRecord}
              onEditBrewRecord={(record) => {    // ✨ 新增這個 prop
                setEditingBrewRecord(record);    // 記住正在編輯哪一筆
                setShowBrewForm(true);           // 打開表單
              }}
            />

          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-6">
            <BrewRecordForm
              key={editingBrewRecord?.id ?? "new"}  // ✅ 換記錄時強迫 React 重新掛載 form
              brewRecords={brewRecords}
              initialData={editingBrewRecord ?? undefined}  // ✨ 有值就是編輯
              onSubmit={editingBrewRecord ? handleUpdateBrewRecord : handleAddBrewRecord}
              onCancel={() => {
                setShowBrewForm(false);
                setEditingBrewRecord(null);
              }}
            />
          </div>
        )}
      </div>
      {session?.user && <NotesWidget userId={session.user.id} />}
    </>
  );
}
