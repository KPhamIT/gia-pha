"use client";

import { useEffect } from "react";

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Các ô mà component này đã đặt thông báo (để không xoá thông báo riêng của form). */
const ours = new WeakSet<Field>();

function isField(el: EventTarget | null): el is Field {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
}

/** Câu báo lỗi tiếng Việt theo trạng thái `validity` của ô nhập. */
export function vietnameseValidationMessage(el: Field): string {
  const v = el.validity;
  const type = el instanceof HTMLInputElement ? el.type : "";
  if (v.valueMissing) {
    if (type === "checkbox") return "Vui lòng đánh dấu vào ô này.";
    if (type === "radio" || el instanceof HTMLSelectElement) return "Vui lòng chọn một mục.";
    if (type === "file") return "Vui lòng chọn file.";
    return "Vui lòng điền thông tin này.";
  }
  if (v.typeMismatch) {
    if (type === "email") return "Email chưa đúng định dạng (ví dụ: ten@gmail.com).";
    if (type === "url") return "Đường dẫn chưa đúng định dạng (ví dụ: https://…).";
    return "Giá trị chưa đúng định dạng.";
  }
  if (v.badInput) return type === "number" ? "Vui lòng nhập số." : "Giá trị không hợp lệ.";
  if (v.tooShort && "minLength" in el) return `Cần ít nhất ${el.minLength} ký tự (hiện có ${el.value.length}).`;
  if (v.tooLong && "maxLength" in el) return `Tối đa ${el.maxLength} ký tự.`;
  if (v.rangeUnderflow && "min" in el) return `Giá trị phải từ ${el.min} trở lên.`;
  if (v.rangeOverflow && "max" in el) return `Giá trị không được lớn hơn ${el.max}.`;
  if (v.stepMismatch) return "Giá trị không hợp lệ.";
  if (v.patternMismatch) return el.title || "Giá trị chưa đúng định dạng.";
  return "Giá trị không hợp lệ.";
}

/**
 * Trình duyệt hiện thông báo kiểm tra form (`required`, `type="email"`, `min`…) theo ngôn ngữ
 * của trình duyệt — thường là tiếng Anh. Gắn một lần ở layout gốc để đổi sang tiếng Việt cho mọi form.
 */
export default function VietnameseFormValidation() {
  useEffect(() => {
    const onInvalid = (e: Event) => {
      const el = e.target;
      if (!isField(el)) return;
      // Form tự đặt thông báo riêng (setCustomValidity) thì giữ nguyên.
      if (el.validity.customError && !ours.has(el)) return;
      el.setCustomValidity("");
      if (el.validity.valid) return;
      el.setCustomValidity(vietnameseValidationMessage(el));
      ours.add(el);
    };
    const onEdit = (e: Event) => {
      const el = e.target;
      if (!isField(el) || !ours.has(el)) return;
      el.setCustomValidity("");
      ours.delete(el);
    };
    document.addEventListener("invalid", onInvalid, true);
    document.addEventListener("input", onEdit, true);
    document.addEventListener("change", onEdit, true);
    return () => {
      document.removeEventListener("invalid", onInvalid, true);
      document.removeEventListener("input", onEdit, true);
      document.removeEventListener("change", onEdit, true);
    };
  }, []);

  return null;
}
