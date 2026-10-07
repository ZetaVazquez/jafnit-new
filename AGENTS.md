# Architecture rules

- Resolve stored news image URLs through the shared news image helper before rendering; private storage requires temporary signed access rather than public URLs.