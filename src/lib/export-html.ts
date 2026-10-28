import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeesQuery, kpiTargetsQuery, recordsQuery } from "./data";
import { buildOfflineAppHtml } from "./offline-app";
import { downloadBlob, encrypt, saveLarge, settings } from "./storageService";

export async function collectData(qc: QueryClient) {
  const [employees, records, kpiTargets] = await Promise.all([
    qc.fetchQuery(employeesQuery),
    qc.fetchQuery(recordsQuery),
    qc.fetchQuery(kpiTargetsQuery),
  ]);
  return { employees, records, kpiTargets, exportedAt: new Date().toISOString() };
}

function askKey() {
  const key = window.prompt("Đặt mật khẩu để mã hóa dữ liệu (cần khi mở file):");
  if (!key) toast.error("Đã hủy: cần mật khẩu");
  return key || null;
}

export async function exportOfflineHtml(qc: QueryClient) {
  try {
    const data = await collectData(qc);
    settings.set("lastExportAt", data.exportedAt);
    const html = buildOfflineAppHtml(data);
    downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), "vietcasa-offline-dashboard.html");
    toast.success("Đã tải file HTML");
  } catch (e) {
    toast.error((e as Error).message);
  }
}

export async function exportBackup(qc: QueryClient) {
  const key = askKey();
  if (!key) return;
  try {
    const data = await collectData(qc);
    await saveLarge("last-backup", data, key);
    settings.set("lastBackupAt", data.exportedAt);
    downloadBlob(new Blob([encrypt(JSON.stringify(data), key)], { type: "text/plain" }), `vietcasa-sao-luu-${data.exportedAt.slice(0, 10)}.vcbak`);
    toast.success("Đã sao lưu dữ liệu");
  } catch (e) {
    toast.error((e as Error).message);
  }
}
