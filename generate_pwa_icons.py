"""Generate PWA icons for different sizes."""

from PIL import Image, ImageDraw, ImageFont
import os

# Create icons directory if it doesn't exist
icons_dir = os.path.join('src', 'static', 'icons')
os.makedirs(icons_dir, exist_ok=True)

def create_icon(size):
    """Create an icon of specified size."""
    # Create a new image with gradient background
    img = Image.new('RGBA', (size, size), (10, 15, 28, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient-like effect with circles
    colors = [
        (16, 185, 129, 255),
        (34, 197, 94, 255),
        (51, 215, 160, 255),
    ]
    
    # Draw concentric circles for gradient effect
    circle_radius = size // 2
    for i, color in enumerate(colors):
        current_radius = circle_radius - (i * circle_radius // 4)
        draw.ellipse(
            [(size//2 - current_radius, size//2 - current_radius),
             (size//2 + current_radius, size//2 + current_radius)],
            fill=color,
            outline=color
        )
    
    # Draw agricultural icon (wheat stem)
    draw.line(
        [(size//2, size//4), (size//2, size*3//4)],
        fill=(255, 255, 255, 255),
        width=max(2, size//32)
    )
    
    # Draw wheat heads
    head_y = size // 4
    for x_offset in [-size//6, size//6]:
        # Draw simple wheat head representation
        draw.polygon(
            [
                (size//2 + x_offset, head_y),
                (size//2 + x_offset - size//16, head_y - size//16),
                (size//2 + x_offset + size//16, head_y - size//16),
            ],
            fill=(255, 255, 255, 255)
        )
    
    return img

# Generate icons for all required sizes
icon_sizes = [72, 96, 128, 144, 152, 192, 384, 512]

print("🎨 Generating PWA icons...")
for size in icon_sizes:
    icon = create_icon(size)
    filepath = os.path.join(icons_dir, f'icon-{size}x{size}.png')
    icon.save(filepath, 'PNG')
    print(f"  ✓ Created {size}x{size} icon")

# Create shortcut icons (simple variations)
def create_shortcut_icon(filename, emoji, bg_color):
    """Create shortcut icons with emoji."""
    size = 96
    img = Image.new('RGBA', (size, size), bg_color + (255,))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded square background
    margin = 8
    draw.rectangle(
        [(margin, margin), (size-margin, size-margin)],
        fill=bg_color + (255,),
        outline=(255, 255, 255, 50),
        width=2
    )
    
    # Add emoji or symbol
    # Using text as fallback
    text_size = size // 3
    draw.text(
        (size//2, size//2),
        emoji,
        fill=(255, 255, 255, 255),
        anchor="mm"
    )
    
    return img

# Shortcut icons
shortcuts = [
    ('analysis-shortcut.png', '🔬', (16, 185, 129)),
    ('camera-shortcut.png', '📷', (14, 165, 233)),
    ('dashboard-shortcut.png', '📊', (245, 158, 11)),
    ('pest-shortcut.png', '🐛', (239, 68, 68)),
]

print("\n🎯 Generating shortcut icons...")
for filename, emoji, color in shortcuts:
    try:
        icon = create_shortcut_icon(filename, emoji, color)
        filepath = os.path.join(icons_dir, filename)
        icon.save(filepath, 'PNG')
        print(f"  ✓ Created {filename}")
    except Exception as e:
        print(f"  ✗ Error creating {filename}: {e}")

print("\n✅ PWA icon generation complete!")
print(f"📁 Icons saved to: {icons_dir}")
