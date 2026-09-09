---
'zele': patch
---

Fix `mail list --filter is:unread` returning sent mail that is not unread, and stop rewriting `from` to the other party.

Gmail search can lag `threads.get`: `is:unread` still returns threads that are already read. After hydration, drop threads whose UNREAD/STARRED flags do not match the query, including `-is:unread` and `is:read`. Keep fetching pages until `--limit` real matches are filled. `from` is the latest From header. Latest SENT messages get `flags: sent`. `--label` resolves the label name to a Gmail id.

```bash
zele mail list --filter "is:unread"
# from is the sender of the latest message
# sent-only threads that are not unread are omitted
# flags: sent when the latest message is one you sent

zele mail list --label Work
```
