# Icons

The icons the elements draw themselves, and the sprite the docs examples use for prefix, suffix and icon slots.

## Built-in glyphs

Elements render these from glyph(name) in base.ts, so a page needs no sprite for a component's own icons: the copy button's check, the menu's lock, the note's alert. 24-box strokes at 16px.
checkxchevchev-dchev-lchev-uarrow-uarrow-dcopysearchinfoalertwarnarrowbackupdownsunmoonmonitordotsplaypausefolderfilecalendarglobelockextboltlayersv0

## Slot icons

Example markup passes icons into slots as inline SVG. Any 24-box stroke icon works; the docs use a sprite of symbols with #i-&lt;name&gt; ids, referenced as &lt;svg class="ic"&gt;&lt;use href="#i-check"/&gt;&lt;/svg&gt;. In an artifact, inline the paths you use.

