import sys

with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_card = False
card_indent = ""

for line in lines:
    # Detect the start of a card
    if '<div class="pricing-card' in line:
        in_card = True
        card_indent = line[:len(line) - len(line.lstrip())]
        new_lines.append(line)
        continue
    
    # Detect the price section
    if in_card and ('<div class="card-price">' in line or '<!-- TODO: Ganti teks di bawah dengan harga aktual' in line):
        # Insert toggle button and open details wrapper
        indent = card_indent + "  "
        new_lines.append(indent + '<button class="btn btn-outline btn-detail" style="margin-bottom: 15px; width: 100%; color: var(--clr-accent); border-color: var(--clr-accent);" onclick="toggleDetails(this)">Lihat Detail</button>\n')
        new_lines.append(indent + '<div class="card-details" style="display: none;">\n')
        
        # Turn off in_card to wait for the end of the card
        in_card = False
        in_details = True
        
        new_lines.append(line)
        continue
    
    # Wait, how to find the end of the card? The card ends with `</div>` at `card_indent` level.
    if 'in_details' in locals() and in_details and line.startswith(card_indent + '</div>'):
        # Close the details wrapper before the card closes
        new_lines.append(card_indent + '  </div><!-- /card-details -->\n')
        new_lines.append(line)
        in_details = False
        continue
        
    new_lines.append(line)

with open("index.html", "w", encoding="utf-8") as f:
    f.writelines(new_lines)

