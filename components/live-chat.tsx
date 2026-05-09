"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Bell, Bot, ImagePlus, Send } from "lucide-react";
import { db, storage } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Message = { id: string; sender: "client" | "admin" | "ai"; text: string; fileUrl?: string; createdAt?: any };

export function LiveChat({ admin = false }: { admin?: boolean }) {
  const [chatId, setChatId] = useState("public-demo-chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!db) return;
    const chatRef = doc(db, "chats", chatId);
    setDoc(chatRef, { updatedAt: serverTimestamp(), unreadClient: 0, unreadAdmin: 0 }, { merge: true });
    const unsubMessages = onSnapshot(query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc")), (snap) => {
      setMessages(snap.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Message, "id">) })));
    });
    const unsubChat = onSnapshot(chatRef, (snap) => {
      setOnline(Boolean(snap.data()?.adminOnline));
      setTyping(Boolean(admin ? snap.data()?.clientTyping : snap.data()?.adminTyping));
    });
    return () => {
      unsubMessages();
      unsubChat();
    };
  }, [chatId, admin]);

  const helper = useMemo(() => (!online && !admin ? "AI fallback is active while support is offline." : "Messages sync live through Firestore."), [online, admin]);

  async function send(file?: File) {
    if (!text.trim() && !file) return;
    if (!db) {
      toast.error("Firebase is required for live chat.");
      return;
    }
    let fileUrl = "";
    if (file && storage) {
      const fileRef = ref(storage, `uploads/chat/${chatId}/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }
    await addDoc(collection(db, "chats", chatId, "messages"), {
      sender: admin ? "admin" : "client",
      text,
      fileUrl,
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "chats", chatId), {
      updatedAt: serverTimestamp(),
      [admin ? "unreadClient" : "unreadAdmin"]: 1,
      [admin ? "adminTyping" : "clientTyping"]: false
    });

    if (!online && !admin) {
      const ai = await fetch("/api/ai/chat", { method: "POST", body: JSON.stringify({ message: text, history: messages.slice(-8).map((m) => ({ role: m.sender === "client" ? "user" : "assistant", content: m.text })) }) });
      const data = await ai.json();
      await addDoc(collection(db, "chats", chatId, "messages"), { sender: "ai", text: data.reply, createdAt: serverTimestamp() });
    }
    setText("");
  }

  async function setPresence(value: boolean) {
    if (!db) return;
    await setDoc(doc(db, "chats", chatId), { adminOnline: value }, { merge: true });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="glass rounded-[2rem] p-5">
        <p className="font-bold">{admin ? "Support Console" : "Live Support"}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{helper}</p>
        <div className="mt-5 rounded-2xl bg-white/70 p-4 text-sm dark:bg-white/5">
          <span className={`mr-2 inline-block size-2 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`} />
          Admin is {online ? "online" : "offline"}
        </div>
        {admin ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={() => setPresence(true)} className="h-10">Online</Button>
            <Button onClick={() => setPresence(false)} variant="secondary" className="h-10">Offline</Button>
          </div>
        ) : null}
        <label className="mt-4 grid gap-2 text-sm">
          Conversation ID
          <input value={chatId} onChange={(e) => setChatId(e.target.value)} className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
        </label>
        <Button variant="secondary" className="mt-4 w-full" onClick={() => Notification.requestPermission()}><Bell size={17} />Enable notifications</Button>
      </aside>
      <section className="glass flex min-h-[560px] flex-col rounded-[2rem] p-4">
        <div className="flex-1 space-y-3 overflow-auto rounded-[1.5rem] bg-white/50 p-4 dark:bg-white/5">
          {messages.length ? messages.map((message) => (
            <div key={message.id} className={`max-w-[82%] rounded-3xl p-4 text-sm ${message.sender === "client" ? "ml-auto bg-ink text-white dark:bg-white dark:text-ink" : "bg-white shadow-sm dark:bg-slate-800"}`}>
              <p className="mb-1 text-xs uppercase tracking-[0.14em] opacity-60">{message.sender === "ai" ? "AI Assistant" : message.sender}</p>
              <p>{message.text}</p>
              {message.fileUrl ? <a className="mt-2 block underline" href={message.fileUrl} target="_blank">View upload</a> : null}
            </div>
          )) : <div className="grid h-full place-items-center text-sm text-slate-500">Start a conversation or use the AI fallback.</div>}
        </div>
        {typing ? <p className="px-3 py-2 text-xs text-cyan-700 dark:text-cyan-300">Typing...</p> : null}
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onFocus={() => db && setDoc(doc(db, "chats", chatId), { [admin ? "adminTyping" : "clientTyping"]: true }, { merge: true })} placeholder="Type your message" className="focus-ring min-w-0 flex-1 rounded-full border border-slate-200 bg-white/80 px-5 dark:border-white/10 dark:bg-white/5" />
          <label className="focus-ring grid size-11 cursor-pointer place-items-center rounded-full glass">
            <ImagePlus size={18} />
            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && send(e.target.files[0])} />
          </label>
          <Button onClick={() => send()}><Send size={18} /></Button>
        </div>
      </section>
    </div>
  );
}
