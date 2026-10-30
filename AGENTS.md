<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the imported Vietcasa TanStack routes, UI modules, and design tokens; this keeps future changes aligned with the source app.
- Use this project’s generated Cloud integration and isolated data rather than the source repository’s environment files; imports must not touch the original app’s users or records.
- Home-screen support is manifest-only with shared head tags in the TanStack root route; no app-shell service worker is needed without an explicit offline request.
- Authenticated navigation uses the existing Sheet primitive below the desktop breakpoint; reuse the same navigation links to preserve role visibility and drawer accessibility.
- Dashboard voucher details reuse RecordForm in read-only mode; viewing records must not introduce new write permissions.
- Keep remainingDebt separate from outstanding/collected chart calculations; form settlement changes must not silently alter existing dashboard aggregates.
