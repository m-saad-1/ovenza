import os
import re

target_dir = r"e:\Web_Development\ovenza"

# Replace map
replacements = {
    # Brand Name
    "Meldough": "Ovenza",
    "meldough": "ovenza",
    "MELDOUGH": "OVENZA",
    
    # Old colors that might exist (based on findings and instructions)
    "#719397": "#790909",
    "#EB1C24": "#790909",
    "#fb6815": "#790909",
    "#d9534f": "#790909",
    "rgb(235, 28, 36)": "#790909",
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return
        
    new_content = content
    # Replace simple strings
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(target_dir):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.css', '.js', '.md', '.json')):
            process_file(os.path.join(root, file))

print("Done replacements.")
