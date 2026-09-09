---
'zele': patch
---

Fix `mail list --filter is:unread` returning sent mail that is not unread, and stop rewriting `from` to the other party.

Gmail search can lag `threads.get`: `is:unread` still returns threads that are already read. After hydration, drop threads whose UNREAD/STARRED flags do not match the query, including `-is:unread` and `is:read`. `from` is always the latest message From header, so a mail you sent no longer looks inbound.

```bash
zele mail list --filter "is:unread"
# from is the sender of the latest message
# sent-only threads that are not unread are omitted
```
