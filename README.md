# SlotBook

SlotBook is an appointment booking platform for small service businesses. This branch contains the hosted, database-backed implementation.

## Live app

- App URL: https://slotbook.hatchable.site
- Admin dashboard: https://slotbook.hatchable.site/admin/
- Sign-in: https://slotbook.hatchable.site/login

**Visibility note:** the hosting project is currently private. The owner must change its visibility to **Public** in the hosting console before ordinary visitors can use the app. Until then, a temporary preview link can be used for review.

## Features implemented

- Responsive customer-facing landing page and service catalogue.
- Email one-time-code customer sign-in, managed by the hosting platform.
- Service availability by date, based on weekly opening hours and blocked dates.
- Appointment creation, customer appointment history, and cancellation.
- Server-side validation of appointment times.
- PostgreSQL exclusion constraint that rejects overlapping confirmed appointments, including simultaneous booking attempts.
- Owner-only dashboard for service management, appointment status changes, weekly opening hours, and blocked dates.
- Seeded sample services and opening hours.
- Database-backed storage; no MongoDB credentials are required for this hosted version.

## Source layout

- `public/`: customer website, styles, sign-in page, and owner dashboard.
- `api/`: service, availability, booking, and owner-management endpoints.
- `migrations/`: database tables, indexes, overlap protection, and starter data.
- `hatchable.toml`: hosted project and sign-in configuration.

The original `backend/` directory is preserved from the earlier Node/MongoDB starter. It is not used by the hosted implementation in this branch.

## Default demo setup

Starter services are inserted on first deployment. Weekly hours are initially Monday–Friday 09:00–17:00 and weekends 10:00–14:00, in India Standard Time. Change them from the owner dashboard.

## Important limitations before public launch

- The hosting project must be switched from private to public in its console settings.
- The email-code sign-in flow should be tested in a normal browser using an email address you control.
- Add your actual business name, service descriptions, prices, opening hours, cancellation policy, and time zone before accepting real customers.
- Email reminders, payment processing, multi-staff calendars, and multi-business tenancy are not included.
- The admin dashboard is restricted to the project owner/admin account, not ordinary customer accounts.

## Security

Customer booking endpoints require a signed-in app user. Owner-management endpoints are restricted to the hosting project's admin/owner role. The database rejects overlapping confirmed appointment intervals. Never commit passwords, API keys, or real environment secrets.

## License

MIT — see [LICENSE](LICENSE).
