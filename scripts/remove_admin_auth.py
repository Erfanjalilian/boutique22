from pathlib import Path
import re

root = Path('src/app/api/admin')
for path in sorted(root.rglob('route.ts')):
    text = path.read_text(encoding='utf-8')
    original = text
    # Remove auth imports
    text = re.sub(r'import \{ (?:getSession|getAdminSessionOrFallback) \} from "@/lib/auth";\n', '', text)
    # Remove requireAdmin helper function blocks
    text = re.sub(r'async function requireAdmin\(\) \{[\s\S]*?^\}\n\n', '', text, flags=re.MULTILINE)
    # Remove explicit requireAdmin checks
    text = re.sub(r'^\s*if \(!\(await requireAdmin\(\)\)\) return apiError\("Unauthorized", 401\);\n', '', text, flags=re.MULTILINE)
    # Remove session checks
    text = re.sub(r'^\s*const session = await getSession\(\);\n', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*if \(!session \|\| session\.role !== "admin"\) return apiError\("Unauthorized", 401\);\n', '', text, flags=re.MULTILINE)
    # Remove extra newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Updated {path}')
