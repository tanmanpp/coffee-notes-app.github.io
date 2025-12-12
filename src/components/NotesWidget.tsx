import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import type { Note } from "../App";
import { StickyNote, X, Trash2 } from "lucide-react";
import Draggable from "react-draggable";
import { createPortal } from "react-dom";

interface NotesWidgetProps {
  userId: string;
}

export function NotesWidget({ userId }: NotesWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fabRef = useRef<HTMLDivElement>(null);
  // 偵測是否為觸控裝置
  const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // 載入筆記
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setNotes(
            data.map((row) => ({
              id: row.id,
              userId: row.user_id,
              content: row.content,
              createdAt: row.created_at,
            }))
          );
        }
      });
  }, [userId]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);
    const { data } = await supabase
      .from("notes")
      .insert({ user_id: userId, content: newNote.trim() })
      .select()
      .single();
    setIsSaving(false);
    if (data) {
      setNotes((prev) => [{ ...data, userId } as Note, ...prev]);
      setNewNote("");
    }
  };

  const deleteNote = async (id: string | number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notes").delete().eq("id", id);
  };

  const portalRoot =
    typeof document !== "undefined" ? document.body : null;

  return (
    <>
      {/* 🔶 右下角小橘點（可拖曳） */}
      {/* 🔶 右下角小橘點（桌機可拖曳，手機可點開） */}
      <Draggable nodeRef={fabRef} disabled={isTouchDevice}>
        <div
          ref={fabRef}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 999999,
            touchAction: "none", // ✅ 避免拖曳/觸控衝突
            pointerEvents: "auto",
          }}
        >
          <button
            type="button"
            // ✅ 桌機 click
            onClick={() => setIsOpen((prev) => !prev)}
            // ✅ 手機/觸控：用 touchend 保證會觸發
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="w-16 h-16 rounded-full bg-amber-600 hover:bg-amber-700 shadow-2xl flex items-center justify-center border-4 border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <StickyNote className="w-9 h-9 text-white drop-shadow-md" />
          </button>
        </div>
      </Draggable>

      {/* 🔶 中央浮動筆記面板 */}
      {isOpen &&
        portalRoot &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 999998,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setIsOpen(false)}
          >
            {/* 背景遮罩 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(4px)",
              }}
            />

            {/* 面板本體：高度固定 80vh，好讓裡面可以切出捲動區 */}
            <div
              style={{
                position: "relative",
                backgroundColor: "white",
                borderRadius: "1.5rem",
                maxWidth: "48rem",
                width: "90vw",
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #FCD9A6",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-amber-50">
                <h3 className="text-xl font-bold text-amber-900">
                  我的筆記
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-amber-200 transition"
                >
                  <X className="w-5 h-5 text-amber-700" />
                </button>
              </div>

              {/* 內容：上輸入、下歷史筆記 */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                {/* 新增筆記區 */}
                <div
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #FDE7C5",
                    background: "#FFFBF5",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <textarea
                    className="w-full border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-24 resize-none text-sm placeholder:text-amber-300 px-3 py-3"
                    placeholder="今天想記什麼？"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button
                    onClick={addNote}
                    disabled={isSaving || !newNote.trim()}
                    className="w-full py-2.5 text-sm font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:hover:bg-amber-600 text-white transition"
                  >
                    {isSaving ? "儲存中…" : "新增筆記"}
                  </button>
                </div>

                {/* 歷史筆記標題列 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingInline: "4px",
                    marginTop: "4px",
                  }}
                >
                  <span className="text-sm font-medium text-amber-900">
                    歷史筆記
                  </span>
                  {notes.length > 0 && (
                    <span className="text-xs text-amber-500">
                      共 {notes.length} 則
                    </span>
                  )}
                </div>

                {/* ✅ 歷史筆記捲動區：獨立一塊，maxHeight + overflowY */}
                <div
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #FDE7C5",
                    background: "#FFFDF8",
                    padding: "12px",
                    marginTop: "4px",
                    maxHeight: "40vh", // 限制高度
                    overflowY: "auto",  // 在這一塊裡面捲動
                  }}
                >
                  {notes.length === 0 ? (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="text-sm text-amber-500 text-center">
                        還沒有筆記，先寫一則吧 ☕
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <article
                          key={note.id}
                          className="bg-white border border-amber-100 rounded-xl px-3.5 py-3 shadow-sm hover:shadow transition flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-amber-500">
                              {new Date(
                                note.createdAt
                              ).toLocaleString("zh-TW", {
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).replace("Invalid Date","")} 
                              {/* 如果後端時間有問題，先避免爆紅字 */}
                            </span>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-red-50 transition group"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:text-red-600" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {note.content}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
}
