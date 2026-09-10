# Logs

Striped 30px mono rows: time, method, status, host, path. House component; Geist has no page for it.

## Default

```html
<acme-logs rows='[{"time":"12:02:14","method":"GET","status":200,"host":"acme.vercel.app","path":"/api/tasks"},{"time":"12:02:15","method":"POST","status":201,"host":"acme.vercel.app","path":"/api/tasks"},{"time":"12:02:19","method":"GET","status":500,"host":"acme.vercel.app","path":"/api/tasks/42"}]'></acme-logs>
```

## `<acme-logs>`

Vercel logs: striped 30px mono rows. Pass `rows` of {time, method, status, host, path}.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `rows` | `rows` | `{ time: string; method: string; status: number; host: string; path: string }[]` | `[]` |  |

