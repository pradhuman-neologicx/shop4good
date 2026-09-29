import os
import re

workspace = r"d:\shop4good\src\app\website"

def update_ts_file(ts_path):
    with open(ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "NgOptimizedImage" not in content and "@Component" in content:
        content = "import { NgOptimizedImage } from '@angular/common';\n" + content
        imports_match = re.search(r"imports:\s*\[([^\]]*)\]", content)
        if imports_match:
            imports_str = imports_match.group(1)
            if "NgOptimizedImage" not in imports_str:
                new_imports_str = imports_str.strip()
                if new_imports_str and not new_imports_str.endswith(","):
                    new_imports_str += ", "
                new_imports_str += "NgOptimizedImage"
                content = content[:imports_match.start(1)] + new_imports_str + content[imports_match.end(1):]
        
        with open(ts_path, "w", encoding="utf-8") as f:
            f.write(content)

def update_html_file(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_content = content
    
    if "home.component.html" in html_path:
        content = content.replace('<img [src]="brandLogos[($index) % brandLogos.length].src"', '<img [ngSrc]="brandLogos[($index) % brandLogos.length].src" width="150" height="60"')
        content = content.replace('<img [src]="brandLogos[(($index) + 3) % brandLogos.length].src"', '<img [ngSrc]="brandLogos[(($index) + 3) % brandLogos.length].src" width="150" height="60"')
        content = content.replace('<img src="assets/steps_image.jpg"', '<img ngSrc="assets/steps_image.jpg" width="800" height="600"')
    
    if "ngo-impact.component.html" in html_path:
        content = content.replace('<img src="assets/ngo_impact.jpg"', '<img ngSrc="assets/ngo_impact.jpg" width="600" height="400"')
        
    if "navbar.component.html" in html_path:
        content = content.replace('<img src="assets/logo.png"', '<img ngSrc="assets/logo.png" width="150" height="100"')
        
    if "marketplace-modal.component.html" in html_path:
        content = content.replace('<img [src]="brand.src"', '<img [ngSrc]="brand.src" width="100" height="40"')
        
    if "faq.component.html" in html_path:
        content = content.replace('<img src="assets/shop4good_hero.jpg"', '<img ngSrc="assets/shop4good_hero.jpg" width="600" height="400"')
        
    if "causes.component.html" in html_path:
        content = content.replace('<img [src]="cause.image"', '<img [ngSrc]="cause.image" width="400" height="300"')
        
    if "slug.component.html" in html_path:
        content = content.replace('<img [src]="ngo.coverImage"', '<img [ngSrc]="ngo.coverImage" fill')
        content = content.replace('w-32 h-32 md:w-48 md:h-48 rounded-full', 'relative w-32 h-32 md:w-48 md:h-48 rounded-full')
        content = content.replace('<img [src]="ngo.logo"', '<img [ngSrc]="ngo.logo" fill')
        content = content.replace('<img [src]="causeDetail.images[selectedImageIndex]"', '<img [ngSrc]="causeDetail.images[selectedImageIndex]" fill')
        content = content.replace('<img [src]="img"', '<img [ngSrc]="img" fill')
        
    if "ngo.component.html" in html_path:
        content = content.replace('<div class="absolute inset-0 bg-[#05413e]">', '<div class="absolute inset-0 bg-[#05413e] relative">')
        content = content.replace('<img src="assets/ngo_hero_bg.jpg"', '<img ngSrc="assets/ngo_hero_bg.jpg" fill')
        content = content.replace('<img [src]="ngo.coverImage"', '<img [ngSrc]="ngo.coverImage" fill')
        content = content.replace('<img [src]="ngo.logo"', '<img [ngSrc]="ngo.logo" fill')
        
    if "login.component.html" in html_path or "register.component.html" in html_path:
        content = content.replace('<img src="assets/logo.png"', '<img ngSrc="assets/logo.png" width="150" height="48"')

    if content != original_content:
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

for root, dirs, files in os.walk(workspace):
    for file in files:
        if file.endswith(".component.ts"):
            ts_path = os.path.join(root, file)
            html_path = ts_path.replace(".ts", ".html")
            
            if os.path.exists(html_path):
                modified = update_html_file(html_path)
                if modified or "contact.component.html" in html_path or "header-section.component.html" in html_path or "footer.component.html" in html_path:
                    update_ts_file(ts_path)

print("Done migrating to NgOptimizedImage!")
