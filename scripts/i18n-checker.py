import json
import os
import re

def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {file_path}")
        return {}

def flatten_json(y):
    out = {}
    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '.')
        elif type(x) is list:
            i = 0
            for a in x:
                flatten(a, name + str(i) + '.')
                i += 1
        else:
            out[name[:-1]] = x
    flatten(y)
    return out

def get_keys_from_json(json_data):
    flat_data = flatten_json(json_data)
    return set(flat_data.keys())

def find_translation_keys_in_src(src_dir):
    keys_in_code = []
    # Regex to capture t('key') or t("key") or t(`key`)
    # Also handles some variations like t( 'key' )
    pattern = re.compile(r"t\(\s*['\"`]([^'\"`]+)['\"`]\s*\)")
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for line_num, line in enumerate(lines, 1):
                            matches = pattern.findall(line)
                            for match in matches:
                                # Filter out likely false positives (e.g. dynamic keys with ${})
                                if '${' not in match:
                                    keys_in_code.append({
                                        'key': match,
                                        'file': file_path,
                                        'line': line_num
                                    })
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
    return keys_in_code

def main():
    base_dir = "/Users/macbookprom1/mekong-cli/apps/84tea"
    vi_path = os.path.join(base_dir, "messages/vi.json")
    en_path = os.path.join(base_dir, "messages/en.json")
    src_dir = os.path.join(base_dir, "src")

    print(f"Loading {vi_path}...")
    vi_data = load_json(vi_path)
    print(f"Loading {en_path}...")
    en_data = load_json(en_path)

    vi_keys = get_keys_from_json(vi_data)
    en_keys = get_keys_from_json(en_data)

    print("-" * 30)
    print("COMPARISON: vi.json vs en.json")
    print("-" * 30)

    missing_in_vi = en_keys - vi_keys
    missing_in_en = vi_keys - en_keys

    if missing_in_vi:
        print(f"\nKeys present in EN but MISSING in VI ({len(missing_in_vi)}):")
        for k in sorted(missing_in_vi):
            print(f"  - {k}")
    else:
        print("\nNo keys missing in VI (compared to EN).")

    if missing_in_en:
        print(f"\nKeys present in VI but MISSING in EN ({len(missing_in_en)}):")
        for k in sorted(missing_in_en):
            print(f"  - {k}")
    else:
        print("\nNo keys missing in EN (compared to VI).")

    print("\n" + "-" * 30)
    print("CODEBASE SCAN: Checking usage in src/")
    print("-" * 30)

    keys_in_code = find_translation_keys_in_src(src_dir)
    print(f"Found {len(keys_in_code)} translation calls in code.")

    missing_in_both = []
    missing_in_vi_code = []
    missing_in_en_code = []

    all_defined_keys = vi_keys.union(en_keys)

    for item in keys_in_code:
        key = item['key']
        file_loc = f"{item['file'].replace(base_dir + '/', '')}:{item['line']}"
        
        # Check if key exists in either
        if key not in vi_keys and key not in en_keys:
             missing_in_both.append(f"MISSING IN BOTH: '{key}' at {file_loc}")
        elif key not in vi_keys:
             missing_in_vi_code.append(f"MISSING IN VI: '{key}' at {file_loc}")
        elif key not in en_keys:
             missing_in_en_code.append(f"MISSING IN EN: '{key}' at {file_loc}")

    if missing_in_both:
        print(f"\nKeys used in code but MISSING IN BOTH files ({len(missing_in_both)}):")
        for msg in missing_in_both:
            print(f"  - {msg}")
    else:
        print("\nAll keys used in code are defined in at least one file.")

    if missing_in_vi_code:
        print(f"\nKeys used in code but MISSING IN VI ({len(missing_in_vi_code)}):")
        for msg in missing_in_vi_code:
            print(f"  - {msg}")

    if missing_in_en_code:
        print(f"\nKeys used in code but MISSING IN EN ({len(missing_in_en_code)}):")
        for msg in missing_in_en_code:
            print(f"  - {msg}")

if __name__ == "__main__":
    main()
