# How to Add Events to the Newsletter

Edit `newsletter-highlights.json` at the root of the repo to announce events BDP is attending. The entry appears as a banner at the top of the weekly newsletter and is automatically shown/hidden based on the date range.

## Example entry

```json
{
  "id": "unique-id",
  "type": "event",
  "title": "Your Event Title",
  "content": "A short sentence about the event and why people should care.",
  "link": "https://example.com",
  "start_date": "2026-04-01",
  "end_date": "2026-04-30"
}
```

## Fields

| Field        | Required | Description |
|--------------|----------|-------------|
| `id`         | Yes      | Unique identifier (no spaces) |
| `type`       | Yes      | `event`, `product`, `update`, or `tweet` |
| `title`      | Yes      | Heading shown in the banner |
| `content`    | Yes      | Body text of the banner |
| `link`       | No       | Adds a "Learn more →" link at the end |
| `start_date` | Yes      | First newsletter date to show this (YYYY-MM-DD) |
| `end_date`   | Yes      | Last newsletter date to show this (YYYY-MM-DD) |

## Notes

- Multiple active entries are stacked top to bottom.
- To stop showing an entry, delete it or set `end_date` to a past date.
- The newsletter sends every Monday at 12pm UTC — align date ranges to Mondays.
