# Security and Authentication

## Authentication Design
- Login endpoint: `POST /api/auth/login`.
- Users will authenticate with email and password.
- Passwords will be stored as bcrypt hashes, never as plain text.
- Successful login will return a signed JWT.
- The mobile app will send the token in the `Authorization: Bearer <token>` header.
- Protected API routes will reject missing, malformed, expired, or invalid tokens.
- The token will be stored using Expo SecureStore on Android and iOS; the web target uses browser storage because SecureStore is native-only.
- Logout will remove the stored token and return the user to the login screen.

## Authorization
- The JWT payload will contain the user ID and role, with no password or sensitive data.
- Authentication middleware will verify the JWT signature and expiration.
- Role checks will be applied to operations that require elevated permissions.
- Object IDs and ownership or access rules will be checked on the server.

## API Security
- Secrets will be loaded from environment variables.
- JWT secrets, MongoDB connection strings, and credentials will not be committed.
- CORS will be configured for known clients instead of allowing unrestricted origins in production.
- Helmet will add protective HTTP headers.
- Rate limiting will protect login and sensitive endpoints.
- Request bodies, query parameters, IDs, prices, quantities, emails, and status values will be validated.
- MongoDB queries will use Mongoose validation and controlled fields.
- Server-side order totals will be calculated from database product prices; client totals will not be trusted.
- Error responses will avoid exposing stack traces, passwords, tokens, or database details.
- HTTP status codes will distinguish validation, authentication, authorization, not-found, conflict, and server errors.

## Mobile Security
- API requests will use the authenticated token only after login.
- Loading and error states will avoid displaying sensitive response details.
- Tokens will be cleared on logout and authentication failure.
- The laptop web target will use the same API authentication contract as mobile.
- Responsive design will change layout and sizing, not security behavior.

## Verification Checklist
- Test incorrect credentials.
- Test missing, invalid, and expired JWTs.
- Test access to protected routes without authentication.
- Test role restrictions.
- Test validation failures and malformed IDs.
- Test that stored passwords and API errors do not expose secrets.
- Run dependency audit and review reported vulnerabilities before completion.
