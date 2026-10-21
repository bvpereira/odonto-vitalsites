from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
START = '<!-- Generated styles: run python scripts/optimize_assets.py -->'
END = '<!-- End generated styles -->'


def inline_styles(check=False):
    css = (ROOT / 'assets/css/styles.css').read_text(encoding='utf-8')
    # Resolve stylesheet-relative URLs for the document; preserve CSS tokens.
    css = css.replace('../images/', 'assets/images/').replace('../fonts/', 'assets/fonts/')
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = ' '.join(line.strip() for line in css.splitlines() if line.strip())
    block = f'{START}\n    <style id="site-styles">{css}</style>\n    {END}'
    page = ROOT / 'index.html'
    html = page.read_text(encoding='utf-8')
    updated, count = re.subn(re.escape(START) + r'.*?' + re.escape(END), lambda _: block, html, flags=re.S)
    if count != 1:
        raise SystemExit('Expected one generated style block in index.html')
    if check:
        if updated != html:
            raise SystemExit('Inline styles are stale: run python scripts/optimize_assets.py')
    else:
        page.write_text(updated, encoding='utf-8')
    print(f'Inline CSS: {len(css.encode())} bytes; synchronized')


def images():
    from PIL import Image, ImageOps
    directory = ROOT / 'assets/images'
    originals = [p.name for p in directory.iterdir()
                 if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.jfif'}
                 and p.name not in {'hero-banner-mobile.png', 'plano-fundo-hero.jpg'}]
    for name in sorted(set(originals)):
        source = directory / name
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).convert('RGBA' if 'A' in opened.getbands() else 'RGB')
            if name == 'logo.png':
                widths = [280, 560]
            elif name.startswith('hero-mobile'):
                widths = [480, 941]
            elif name == 'hero-banner.png':
                widths = [1100, 1774]
            elif name.startswith('dentista-'):
                widths = [360, image.width]
            elif name.startswith('depoimento-'):
                widths = [96]
            else:
                widths = [min(image.width, 720 if name.startswith('consultorio-') else 960)]
            for width in widths:
                resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
                suffix = f'-{width}' if name.startswith(('logo.', 'hero-', 'dentista-')) else ''
                output = directory / f'{source.stem}{suffix}.webp'
                resized.save(output, 'WEBP', quality=82, method=6)
                print(f'{output.name}: {output.stat().st_size} bytes (source {source.stat().st_size})')


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Synchronize inline CSS; optionally regenerate WebP images (requires Pillow).')
    parser.add_argument('--images', action='store_true')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.images:
        images()
    inline_styles(args.check)
