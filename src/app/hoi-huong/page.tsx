'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scroll,
  Heart,
  Printer,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FamilyMember {
  id: string;
  name: string;
  birthYear: string;
  wish: string;
}

interface Ancestor {
  id: string;
  name: string;
  passedYear: string;
  relation: string;
}

export default function DedicationParchmentPage() {
  const [hostName, setHostName] = useState('Nguyễn Văn An');
  const [dharmaName, setDharmaName] = useState('Thiện Tâm');
  const [address, setAddress] = useState('Việt Nam');

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Trần Thị Mai', birthYear: '1965', wish: 'Thân tâm thường lạc, tiêu trừ tật bệnh' },
    { id: '2', name: 'Nguyễn Minh Tuấn', birthYear: '1992', wish: 'Công việc hanh thông, gia đạo bình an' },
  ]);

  const [ancestors, setAncestors] = useState<Ancestor[]>([
    { id: '1', name: 'Nguyễn Văn Đức', passedYear: 'Năm Tân Mão', relation: 'Ông nội' },
    { id: '2', name: 'Lê Thị Hòa', passedYear: 'Năm Đinh Dậu', relation: 'Bà nội' },
  ]);

  const [copied, setCopied] = useState(false);

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: Date.now().toString(), name: '', birthYear: '', wish: 'Bình an, cát tường' },
    ]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
  };

  const addAncestor = () => {
    setAncestors([
      ...ancestors,
      { id: Date.now().toString(), name: '', passedYear: '', relation: 'Tiên tổ' },
    ]);
  };

  const removeAncestor = (id: string) => {
    setAncestors(ancestors.filter((a) => a.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-text">
      {/* Top Header */}
      <div className="space-y-4 border-b border-ivory-200 dark:border-charcoal-800 pb-6 print:hidden animate-fade-in-up">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trang Chủ</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
            <Scroll className="w-4 h-4 text-amber-600 animate-pulse-glow" />
            <span>Phụng Thỉnh Tam Bảo • Chứng Minh Hồi Hướng</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
            Lập Sớ Hồi Hướng Cho Gia Tộc &amp; Tiên Tổ
          </h1>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl mx-auto leading-relaxed">
            Điền danh tánh thân bằng quyến thuộc và cửu huyền thất tổ để tạo bản sớ trang trọng, dâng lời hồi hướng phước lành sau mỗi thời khóa tu tập.
          </p>
        </div>
      </div>

      {/* Input Form Section (Hidden when printing) */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md p-5 sm:p-7 space-y-6 print:hidden">
        <h2 className="font-heading font-bold text-lg text-charcoal-900 dark:text-ivory-100 flex items-center gap-2 border-b border-ivory-100 dark:border-charcoal-700 pb-3">
          <span>1. Thông Tin Chủ Hộ / Tín Chủ:</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-charcoal-300 mb-1">
              Họ tên tín chủ:
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-ivory-50 dark:bg-charcoal-900 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-charcoal-300 mb-1">
              Pháp danh (nếu có):
            </label>
            <input
              type="text"
              value={dharmaName}
              onChange={(e) => setDharmaName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-ivory-50 dark:bg-charcoal-900 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-charcoal-300 mb-1">
              Cư ngụ tại:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-ivory-50 dark:bg-charcoal-900 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
            />
          </div>
        </div>

        {/* Section 2: Cầu An Thân Bằng Quyến Thuộc */}
        <div className="space-y-3 pt-3 border-t border-ivory-100 dark:border-charcoal-700">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#854D0E] uppercase tracking-wider">
              2. Danh Sách Cầu An (Người Hiện Tiền):
            </h3>
            <button
              onClick={addFamilyMember}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-100 text-[#854D0E] font-bold hover:bg-amber-200 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm người
            </button>
          </div>

          <div className="space-y-2">
            {familyMembers.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Họ tên"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...familyMembers];
                    updated[idx].name = e.target.value;
                    setFamilyMembers(updated);
                  }}
                  className="col-span-4 px-3 py-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-xs sm:text-sm bg-white dark:bg-charcoal-900"
                />
                <input
                  type="text"
                  placeholder="Năm sinh"
                  value={item.birthYear}
                  onChange={(e) => {
                    const updated = [...familyMembers];
                    updated[idx].birthYear = e.target.value;
                    setFamilyMembers(updated);
                  }}
                  className="col-span-3 px-3 py-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-xs sm:text-sm bg-white dark:bg-charcoal-900"
                />
                <input
                  type="text"
                  placeholder="Tâm nguyện cầu an"
                  value={item.wish}
                  onChange={(e) => {
                    const updated = [...familyMembers];
                    updated[idx].wish = e.target.value;
                    setFamilyMembers(updated);
                  }}
                  className="col-span-4 px-3 py-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-xs sm:text-sm bg-white dark:bg-charcoal-900"
                />
                <button
                  onClick={() => removeFamilyMember(item.id)}
                  className="col-span-1 p-1 text-red-500 hover:text-red-700 flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Cầu Siêu Tiên Tổ */}
        <div className="space-y-3 pt-3 border-t border-ivory-100 dark:border-charcoal-700">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#854D0E] uppercase tracking-wider">
              3. Danh Sách Cầu Siêu (Cửu Huyền Thất Tổ):
            </h3>
            <button
              onClick={addAncestor}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-100 text-[#854D0E] font-bold hover:bg-amber-200 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm tiên tổ
            </button>
          </div>

          <div className="space-y-2">
            {ancestors.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Hương linh / Thần vị"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...ancestors];
                    updated[idx].name = e.target.value;
                    setAncestors(updated);
                  }}
                  className="col-span-5 px-3 py-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-xs sm:text-sm bg-white dark:bg-charcoal-900"
                />
                <input
                  type="text"
                  placeholder="Quan hệ (Ông/Bà...)"
                  value={item.relation}
                  onChange={(e) => {
                    const updated = [...ancestors];
                    updated[idx].relation = e.target.value;
                    setAncestors(updated);
                  }}
                  className="col-span-3 px-3 py-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-xs sm:text-sm bg-white dark:bg-charcoal-900"
                />
                <input
                  type="text"
                  placeholder="Năm tạ thế / Ngày kỵ"
                  value={item.passedYear}
                  onChange={(e) => {
                    const updated = [...ancestors];
                    updated[idx].passedYear = e.target.value;
                    setAncestors(updated);
                  }}
                  className="col-span-3 px-3 py-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-xs sm:text-sm bg-white dark:bg-charcoal-900"
                />
                <button
                  onClick={() => removeAncestor(item.id)}
                  className="col-span-1 p-1 text-red-500 hover:text-red-700 flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE SACRED PARCHMENT (BẢN SỚ DÁT VÀNG TRUYỀN THỐNG) */}
      <div className="relative bg-[#FFFDF5] text-[#2A1810] rounded-3xl border-4 border-[#D4AF37] shadow-2xl p-6 sm:p-10 space-y-6">
        {/* Ornate Gold Border Corners */}
        <div className="text-center space-y-2 border-b-2 border-[#D4AF37]/50 pb-4">
          <p className="text-xs tracking-[0.3em] font-heading font-bold text-[#854D0E] uppercase">
            ✦ Nam Mô Bổn Sư Thích Ca Mâu Ni Phật ✦
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#854D0E] tracking-wider uppercase">
            Sớ Hồi Hướng Công Đức Tam Bảo
          </h2>
          <p className="text-xs italic text-[#78350F]">
            Phục dĩ: Phật từ vô lượng, quảng độ quần mê. Nhất tâm kính phụng, phước đức vô biên.
          </p>
        </div>

        {/* Parchment Body */}
        <div className="space-y-4 font-heading text-sm sm:text-base leading-relaxed text-[#2A1810]">
          <p>
            <strong>Đệ tử con là:</strong> {hostName} {dharmaName ? `(Pháp danh: ${dharmaName})` : ''},
            ngụ tại: {address}.
          </p>

          <p>
            Hôm nay nhân ngày lành tháng tốt, chí tâm hướng về mười phương Tam Bảo, trì tụng kinh chú, niệm Phật công đức lành. Nay xin đem toàn bộ công đức thanh tịnh này thành tâm hồi hướng:
          </p>

          {/* Cầu An Block */}
          {familyMembers.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FDF8EC] border border-[#D4AF37]/50 space-y-2">
              <h3 className="font-bold text-[#854D0E] text-sm uppercase">
                ✦ Nguyện Cầu An Thân Bằng Quyến Thuộc:
              </h3>
              <ul className="space-y-1 pl-3 text-xs sm:text-sm">
                {familyMembers.map((item, idx) => (
                  <li key={idx} className="list-disc">
                    <strong>{item.name || 'Người thân'}</strong> {item.birthYear ? `(Sinh năm: ${item.birthYear})` : ''}: {item.wish}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cầu Siêu Block */}
          {ancestors.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FDF8EC] border border-[#D4AF37]/50 space-y-2">
              <h3 className="font-bold text-[#854D0E] text-sm uppercase">
                ✦ Nguyện Cầu Siêu Cửu Huyền Thất Tổ:
              </h3>
              <ul className="space-y-1 pl-3 text-xs sm:text-sm">
                {ancestors.map((item, idx) => (
                  <li key={idx} className="list-disc">
                    Hương linh <strong>{item.name || 'Tiên tổ'}</strong> ({item.relation}): Nguyện nương nhờ Phật lực, siêu sanh Cực Lạc.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="italic text-xs sm:text-sm text-[#78350F] pt-2">
            Nguyện cho phong điều vũ thuận, quốc thái dân an, thế giới hòa bình, chúng sanh an lạc.
            Đệ tử chúng con cùng muôn loài, đồng trọn thành Phật đạo.
          </p>
        </div>

        {/* Signature & Date */}
        <div className="flex justify-between items-end pt-6 border-t border-[#D4AF37]/40 text-xs sm:text-sm">
          <div className="text-center space-y-1">
            <p className="font-bold text-[#854D0E]">Tam Bảo Chứng Minh</p>
            <p className="text-[10px] text-stone-500">Ấn chứng từ bi</p>
          </div>

          <div className="text-center space-y-1">
            <p>Ngày ... tháng ... năm ...</p>
            <p className="font-bold text-[#854D0E]">Đệ tử chí tâm đảnh lễ</p>
            <p className="text-sm font-bold text-[#854D0E] pt-4">{dharmaName || hostName}</p>
          </div>
        </div>

        {/* Action Buttons (Print / Copy) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/30 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#854D0E] hover:bg-[#A16207] text-white font-heading font-bold text-xs sm:text-sm shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In Bản Sớ Này</span>
          </button>
        </div>
      </div>
    </div>
  );
}

