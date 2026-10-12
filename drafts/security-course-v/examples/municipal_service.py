"""Educational model using fictional data only; no HTTP, shell, or template eval.

Actor attributes are assumed to come from a current, trusted server-side store.
Annotations do not enforce values: protected operations validate required inputs.
The fictional department registry contains exactly housing and welfare; only
plain strings matching an entry are valid. No trimming or case folding is done.
This checks the model's registry, not real employment, assignment or freshness.
This is not an authentication system, production service, or rich-HTML sanitizer.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
from html import escape
import sqlite3


DEPARTMENTS = frozenset({"housing", "welfare"})
ROLES = frozenset({"resident", "officer", "admin", "vendor"})


def valid_department(value):
    """Exact membership in the fictional server-owned registry; no coercion."""
    return type(value) is str and value in DEPARTMENTS


def valid_identifier(value):
    """Fictional IDs: nonempty ASCII letters/digits/hyphens/underscores only."""
    return (type(value) is str and bool(value) and value.isascii()
            and all(char.isalnum() or char in "-_" for char in value))


def valid_application_id(value):
    # bool is an int subclass, but True is not an application identifier.
    return type(value) is int and value > 0


def valid_actor(actor):
    return (type(actor) is Actor and valid_identifier(actor.actor_id)
            and type(actor.role) is str and actor.role in ROLES
            and actor.active is True)


def aware_datetime(value):
    return (type(value) is datetime and value.tzinfo is not None
            and value.utcoffset() is not None)


@dataclass(frozen=True)
class Actor:
    actor_id: str
    role: str
    department: str | None = None
    active: bool = True


@dataclass(frozen=True)
class Application:
    application_id: int
    owner_id: str
    department: str | None
    state: str = "draft"


@dataclass(frozen=True)
class Settings:
    public_application_storage: bool = False
    support_enabled: bool = False
    audit_enabled: bool = True
    shared_admin_password: str | None = None


@dataclass(frozen=True)
class SupportGrant:
    actor_id: str
    application_id: int
    expires_at: datetime
    approved: bool


def authorize(actor, operation, application=None, field=None, *,
              attributes_available=True, settings=Settings(), grant=None, now=None):
    """Explicit fictional rules; unknown protected operations and missing data deny.

    Each call needs current trusted attributes; the availability flag must be True.
    Officer read/review require two valid department IDs before equality is tested.
    Resident ownership, admin settings and vendor diagnostics do not depend on
    department. IDs and permission flags are checked, not coerced from truthy data.
    Invalid protected inputs deny. No token cache or concurrency model.
    Diagnostics permits only defined metadata, not raw application contents.
    """
    if type(operation) is not str or (field is not None and type(field) is not str):
        return False
    if operation == "public_notice":
        return application is None and field is None
    if attributes_available is not True or not valid_actor(actor):
        return False
    if operation == "configure":
        return actor.role == "admin" and application is None and field is None
    if (type(application) is not Application
            or not valid_application_id(application.application_id)):
        return False
    if operation == "diagnostics":
        if (type(settings) is not Settings or type(grant) is not SupportGrant
                or not aware_datetime(now) or not aware_datetime(grant.expires_at)):
            return False
        return (settings.support_enabled is True and actor.role == "vendor"
                and grant.approved is True and valid_identifier(grant.actor_id)
                and valid_application_id(grant.application_id)
                and grant.actor_id == actor.actor_id
                and grant.application_id == application.application_id
                # Same-ZoneInfo datetime comparison ignores fold. Compare instants.
                and now.astimezone(timezone.utc) < grant.expires_at.astimezone(timezone.utc)
                and field in {"request_id", "event_code"})
    if actor.role == "resident":
        if (not valid_identifier(application.owner_id)
                or actor.actor_id != application.owner_id):
            return False
        if operation == "read":
            return field in {"name", "comment", "state"}
        if operation == "edit":
            return (type(application.state) is str and application.state == "draft"
                    and field in {"name", "comment"})
    if (actor.role == "officer" and valid_department(actor.department)
            and valid_department(application.department)
            and actor.department == application.department):
        if operation == "read":
            return field in {"name", "comment", "state", "internal_note"}
        if operation == "review":
            return (type(application.state) is str and application.state == "submitted"
                    and field == "decision")
    return False


def fictional_database():
    """Only an in-memory SQLite fixture. Names, IDs and content are invented."""
    connection = sqlite3.connect(":memory:")
    connection.execute("""CREATE TABLE applications (
        id INTEGER PRIMARY KEY, owner_id TEXT, department TEXT,
        name TEXT, comment TEXT, received_at INTEGER, updated_at INTEGER)""")
    connection.executemany("INSERT INTO applications VALUES (?, ?, ?, ?, ?, ?, ?)", [
        (1, "resident-a", "housing", "O'Neil", "架空の申請", 30, 40),
        (2, "resident-a", "housing", "達成率100%", "引用符も正当な文字", 10, 50),
        (3, "resident-b", "welfare", "別の住民", "別部署の架空データ", 20, 60),
        (4, "resident-a", "housing", "引用符' OR '1'='1", "文字列そのもの", 40, 70),
    ])
    return connection


SORTS = {"received": "received_at ASC, id ASC", "updated": "updated_at DESC, id ASC"}


def escape_like_literal(value):
    """SQLite LIKE with an explicit backslash ESCAPE; not a generic SQL escape."""
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def search_applications(connection, actor, query, *, sort="received", literal=True,
                        attributes_available=True):
    """Scope before querying; invalid officer departments give no search authority.

    Both accepted department IDs select only the matching registry value in rows.
    The resident route uses ownership, so absent department does not block it.
    """
    if attributes_available is not True or not valid_actor(actor):
        raise PermissionError("current authorization attributes required")
    if type(query) is not str or len(query) > 80:
        raise ValueError("query must be a string of at most 80 Unicode code points")
    if type(sort) is not str or sort not in SORTS:
        raise ValueError("unknown sort choice")
    if type(literal) is not bool:
        raise ValueError("literal must be a bool")
    if actor.role == "resident":
        scope = "owner_id = ?"
        scope_value = actor.actor_id
    elif actor.role == "officer" and valid_department(actor.department):
        scope = "department = ?"
        scope_value = actor.department
    else:
        raise PermissionError("no application search permission")
    pattern = f"%{escape_like_literal(query) if literal else query}%"
    # These SQL fragments come exclusively from fixed code / SORTS, not query data.
    statement = ("SELECT id, name, comment FROM applications WHERE " + scope
                 + " AND name LIKE ? ESCAPE '\\' ORDER BY " + SORTS[sort] + " LIMIT 20")
    return connection.execute(statement, (scope_value, pattern)).fetchall()


def render_plain_comment(comment):
    """Only ordinary HTML body text in a fixed <p>, not URLs, JS or rich HTML."""
    if not isinstance(comment, str) or len(comment) > 500:
        raise ValueError("comment must be a string of at most 500 code points")
    return "<p>" + escape(comment, quote=True) + "</p>"
