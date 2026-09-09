---
'zele': patch
---

Fix `mail list --filter is:unread` returning sent mail that is not unread, and stop rewriting `from` to the other party.

Inbox search now uses `in:inbox` in the Gmail query, same as `in:sent` for Sent. After hydration, threads that do not have the UNREAD label are dropped. `from` is always the latest message From header, so a mail you sent no longer looks inbound.

```bash
zele mail list --filter "is:unread"
# from is the sender of the latest message
# sent-only threads that are not unread are omitted
```
