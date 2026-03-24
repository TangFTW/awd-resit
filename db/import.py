import json
import argparse
import pymysql
from pathlib import Path

# ----------------- CLI -----------------
ap = argparse.ArgumentParser(description="Import Dog Parks JSON into MySQL")
ap.add_argument("--file", "-f", default="facility-dgpg.json", help="Path to JSON file")
ap.add_argument("--host", default="localhost")
ap.add_argument("--user", default="root")
ap.add_argument("--password", default="")  # <-- adjust
ap.add_argument("--database", default="hk_dgpg")
ap.add_argument("--dry-run", action="store_true", help="Parse and validate only; no DB writes")
args = ap.parse_args()


# ----------------- Load JSON -----------------
p = Path(args.file)
if not p.exists():
    print(json.dumps({
        "header": {
            "success": False,
            "message": f"JSON file not found: {p}",
            "err_code": "4004",
            "err_msg": "File not found"
        },
        "result": []
    }))
    raise SystemExit(1)

raw = p.read_text(encoding="utf-8")
raw = raw.lstrip("\ufeff")  # strip BOM if present
data = json.loads(raw)

rows = data if isinstance(data, list) else (data.get("data", []) if isinstance(data, dict) else [])

if not rows:
    print(json.dumps({
        "header": {
            "success": False,
            "message": "No records to import",
            "err_code": "4004",
            "err_msg": "No records"
        },
        "result": []
    }))
    raise SystemExit(1)

# ----------------- DB connect -----------------
conn = pymysql.connect(
    host=args.host, user=args.user, password=args.password,
    database=args.database, charset="utf8mb4"
)
cur = conn.cursor()

#import json
sql = """
INSERT INTO facilities (
  District_en, District_cn, Name_en, Name_cn, Address_en, Address_cn,
  GIHS, Facilities_en, Facilities_b5, Ancillary_facilities_en, Ancillary_facilities_cn,
  Opening_hours_en, Opening_hours_cn, Phone, Remarks_en, Remarks_cn,
  Longitude, Latitude
) VALUES (
  %(District_en)s, %(District_cn)s, %(Name_en)s, %(Name_cn)s, %(Address_en)s, %(Address_cn)s,
  %(GIHS)s, %(Facilities_en)s, %(Facilities_b5)s, %(Ancillary_facilities_en)s, %(Ancillary_facilities_cn)s,
  %(Opening_hours_en)s, %(Opening_hours_cn)s, %(Phone)s, %(Remarks_en)s, %(Remarks_cn)s,
  %(Longitude)s, %(Latitude)s
)
ON DUPLICATE KEY UPDATE
  District_en = VALUES(District_en), District_cn = VALUES(District_cn),
  Name_en = VALUES(Name_en), Name_cn = VALUES(Name_cn),
  Address_en = VALUES(Address_en), Address_cn = VALUES(Address_cn),
  Facilities_en = VALUES(Facilities_en), Facilities_b5 = VALUES(Facilities_b5),
  Ancillary_facilities_en = VALUES(Ancillary_facilities_en), Ancillary_facilities_cn = VALUES(Ancillary_facilities_cn),
  Opening_hours_en = VALUES(Opening_hours_en), Opening_hours_cn = VALUES(Opening_hours_cn),
  Phone = VALUES(Phone), Remarks_en = VALUES(Remarks_en), Remarks_cn = VALUES(Remarks_cn),
  Longitude = VALUES(Longitude), Latitude = VALUES(Latitude)
"""

stats = {
    "read": 0, "inserted": 0, "updated": 0, "unchanged": 0,
    "skipped": 0, "errors": 0
}
err_samples = []

# Only start a transaction if not a dry-run
if not args.dry_run:
    conn.begin()

processed_records = []

for idx, r in enumerate(rows):
    stats["read"] += 1
    
    
    def nz(s):
        if s is None: return None
        if isinstance(s, str) and s.strip() == "": return None
        return s


    payload = {
        "District_en": r.get("District_en"),
        "District_cn": r.get("District_cn"),
        "Name_en": r.get("Name_en"),
        "Name_cn": r.get("Name_cn"),
        "Address_en": r.get("Address_en"),
        "Address_cn": r.get("Address_cn"),
        "GIHS":        nz(r.get("GIHS")),
        "Facilities_en": r.get("Facilities_en"),
        "Facilities_b5": r.get("Facilities_b5"),
        "Ancillary_facilities_en": r.get("Ancillary_facilities_en"),
        "Ancillary_facilities_cn": r.get("Ancillary_facilities_cn"),
        "Opening_hours_en": r.get("Opening_hours_en"),
        "Opening_hours_cn": r.get("Opening_hours_cn"),
        "Phone": r.get("Phone"),
        "Remarks_en": r.get("Remarks_en"),
        "Remarks_cn": r.get("Remarks_cn"),
        "Longitude": r.get("Longitude"),
        "Latitude": r.get("Latitude")
    }

    processed_records.append(payload)

    if args.dry_run:
        continue

    try:
        cur.execute(sql, payload)
        aff = cur.rowcount
        if aff == 1:   stats["inserted"] += 1
        elif aff == 2: stats["updated"]  += 1
        else:          stats["unchanged"] += 1
    except Exception as e:
        stats["errors"] += 1
        if len(err_samples) < 5:
            err_samples.append({"index": idx, "key": r.get("GIHS"), "error": str(e)})

if not args.dry_run:
    conn.commit()
cur.close()
conn.close()

output = {
    "stats": stats,
    "errors": err_samples
}
print(json.dumps(output, ensure_ascii=False, indent=2))