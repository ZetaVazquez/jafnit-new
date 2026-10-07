# Architecture rules

- Resolve stored news image URLs through the shared news image helper before rendering; private storage requires temporary signed access rather than public URLs.
- Keep human trainer messaging separate from FIT; use authenticated RPCs with server-validated ownership and roles, preserve sessions when dialogs close, and enforce retention in reads plus scheduled cleanup.
- Track client trainer-chat read receipts on the server using displayed message IDs and share unread polling through one query key so notifications persist across views without marking unseen replies as read.
- Centralize trainer contact details in the shared contact module so all contact dialogs use the same values.