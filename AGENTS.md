# Architecture rules

- Resolve stored news image URLs through the shared news image helper before rendering; private storage requires temporary signed access rather than public URLs, and storage reads must be limited to images attached to published news or server-validated admins so drafts and unattached uploads remain private.
- Keep human trainer messaging separate from FIT; use authenticated RPCs with server-validated ownership and roles, preserve sessions when dialogs close, and enforce retention in reads plus scheduled cleanup.
- Track client trainer-chat read receipts on the server using displayed message IDs and share unread polling through one query key so notifications persist across views without marking unseen replies as read.
- Centralize trainer contact details in the shared contact module so all contact dialogs use the same values.
- Keep FIT guest access behind service-only atomic database quotas on callers and every paid gateway iteration; forwarded IP hints are supplementary, while shared guest/global ceilings and fail-closed errors prevent identity rotation from bypassing the budget.
- Preserve the stored instructions field for execution text and save common_errors through the additive admin_upsert_exercise_details RPC; older published clients must remain compatible.
- Copy exercise execution, common errors and library media into manual and generated workout items so assigned plans and direct PDFs preserve the same guidance.
- Resolve verified user-supplied exercise media through the shared exerciseMedia helper and persist absolute URLs for generated plans; never map unrelated movements to fill missing assets.
- Store imported exercise videos and frame-derived posters as CDN asset pointers; use browser-compatible video codecs so the original demonstrations play in workout and library views.
- Share diet portion arithmetic, alternative-aware calorie totals and menu signatures between the generator and UI; keep clinical targets separate and reject repeated weekly dish sets without rewriting saved plans.
