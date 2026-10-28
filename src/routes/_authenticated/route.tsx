import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Download, FileText, LogOut, Settings, TrendingUp, Users, Wallet } from "lucide-react";
import { BrandLogo } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { exportOfflineHtml } from "@/lib/export-html";
import { sessionExpiredByClose } from "@/lib/remember";
import { supabase } from "@/integrations/supabase/client";
import { meQuery, ROLE_LABELS, useMe } from "@/lib/data";
import { FilterProvider } from "@/lib/filters";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (sessionExpiredByClose()) await supabase.auth.signOut();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(meQuery),
  component: Layout,
});

const NAV = [
  { to: "/dashboard-doanh-so", label: "Dashboard Doanh số", icon: TrendingUp },
  { to: "/dashboard-cong-no", label: "Dashboard Công nợ", icon: Wallet },
  { to: "/phieu", label: "Phiếu doanh số", icon: FileText },
] as const;

const SYSTEM_NAV = [
  { to: "/nhan-vien", label: "Nhân viên", icon: Users },
  { to: "/cai-dat", label: "Cài đặt & dữ liệu", icon: Settings },
] as const;


function Layout() {
  const { me, role, isAdmin } = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <FilterProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="flex shrink-0 flex-col bg-dark-gradient text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-60">
          <div className="px-4 py-5">
            <div className="rounded-xl bg-card p-2.5 shadow-card"><BrandLogo className="w-full" /></div>
            <p className="mt-3 px-1 text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/50">Báo cáo kinh doanh</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 md:flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeProps={{ className: "!bg-brand-gradient !text-sidebar-primary-foreground font-medium shadow-card" }}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <p className="mt-4 hidden px-3 text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/50 md:block">Hệ thống</p>
                {SYSTEM_NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeProps={{ className: "!bg-brand-gradient !text-sidebar-primary-foreground font-medium shadow-card" }}
                  >
                    <n.icon className="h-4 w-4" /> {n.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="mt-auto hidden px-4 pb-3 md:block">
            <p className="text-xs leading-relaxed text-sidebar-foreground/40">
              Bản quyền thuộc Vietcasa
              <br />
              Lưu hành nội bộ
              <br />
              made by phuocnhtvietcasa
            </p>
          </div>
          <div className="hidden border-t border-sidebar-border p-4 md:block">
            <p className="truncate text-sm font-medium">{me?.employee?.full_name ?? me?.email}</p>
            <p className="text-xs text-sidebar-primary">{ROLE_LABELS[role]}</p>
            <button onClick={signOut} className="mt-3 flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" /> Đăng xuất
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:hidden">
              <span className="text-sm">{ROLE_LABELS[role]}</span>
              <button onClick={signOut} className="text-sm text-muted-foreground">Đăng xuất</button>
            </div>
            {isAdmin && (
              <Button className="ml-auto bg-foreground text-background hover:bg-foreground/90" onClick={() => exportOfflineHtml(qc)}>
                <Download className="h-4 w-4" /> Tải file HTML
              </Button>
            )}
          </div>
          <Outlet />
        </main>
      </div>
    </FilterProvider>
  );
}
