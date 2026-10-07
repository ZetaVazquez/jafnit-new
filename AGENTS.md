# Architecture rules

- Resolve stored news image URLs through the shared news image helper before rendering; private storage requires temporary signed access rather than public URLs.
- Keep human trainer messaging separate from FIT; use authenticated RPCs with server-validated ownership and roles, hide closed sessions from clients, and enforce retention in reads plus scheduled cleanup.
- Centralize trainer contact details in the shared contact module so all contact dialogs use the same values.