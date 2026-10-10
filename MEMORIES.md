# The four corners

The room is organized around four objects:

1. **Computer:** the complete portfolio, including projects, biography, skills, contact, bulletin-board stories, and certificates.
2. **Bulletin board:** events, hackathons, work experience, and school memories together.
3. **File cabinet:** certificate drawers. Click a drawer to view its certificate and details.
4. **Project TV:** choose a project channel or click the screen to see its description and repository or access link.

## Editing content

`memories.js` supplies both the room objects and the computer folders. The original story collections at the top feed the single bulletin board; its initial selection uses the first two cards from each collection. Change that selection or edit those stories as needed.

Put photos in `assets/memories/` and certificates in `assets/certificates/` (create the directories when adding files). Set `image` to an image path; use `url` for the original PDF, credential verification page, repository, or project files. Set `linkLabel` to describe that link accurately. Each record also supports `title`, `alt`, `description`, `date`, `location`, and `role`. Bulletin-board photos support `style: 'pinned'` or `style: 'taped'`.

Project records support `detailUrl` for the local case study and an optional `demoUrl` for a real playable/live project. Existing example.com demo placeholders are deliberately excluded from the TV. Repository/file URLs were reused from the existing portfolio, not independently verified. WVSolutions links to project files on Google Drive and is labeled accordingly.

Certificate and story entries are labeled placeholders until you supply your own records. No events, awards, or work history have been invented. There are three cabinet drawers; keep three certificate records for the current model. Each can represent a certificate of your choice.

Use the bottom navigation or Left/Right arrow keys to pan. Select an item to open details; Escape closes the popup. Previous/Next browses that collection and also changes the TV channel or active cabinet drawer. The computer provides access to the same content. Accessible item buttons remain available on mobile and if WebGL fails.

Preview with `python -m http.server 8000`, then visit `http://localhost:8000`. Three.js loads from the existing pinned CDN URL. No build step is required.

## Phone interface and performance

Every device starts in the 3D room. At widths up to 760px, the table holds a phone model; wider screens show the PC and its accessories. Resizing across the breakpoint swaps the visible model and updates the camera and labels. The other three room sections remain available.

Tap the physical phone or Use phone to approach it and open the phone apps. Click the PC or Use computer to enter the desktop interface. Both use the same portfolio content. The shortcut at the top skips the approach animation and opens the matching interface. Returning from either interface restores the room. An open interface is preserved during rotation; the room model updates when you return.

Three.js loads on arrival for both device sizes. The room stops rendering after settling and while hidden or covered by a photo dialog; touch devices omit real-time shadows. If the renderer cannot load, a matching phone/PC illustration and working entry button remain available.

Project images in `assets/previews/` are optimized WebP previews; `originalImage` in the project records preserves the original file path. New photos should also have small previews suitable for cards and 3D textures. Full project pages retain their original media.

Browser checks covered 320px and 390px phones, 768px touch tablets, landscape, desktop, and unavailable-CDN behavior in headless Edge. Physical iOS Safari and Android testing remains outstanding; viewport emulation does not establish real-device compatibility.

## Atmosphere controls

Sound starts off on every visit. Use the Sound button in the room footer, computer toolbar, or phone dock to enable or mute the shared interface tones. Tones are synthesized locally after opt-in, with no audio-file downloads or background music. Audio suspends when the tab is hidden.

Clickable 3D objects receive a subtle hover outline and press feedback. Content panels use short entrance transitions; reduced-motion preferences disable those animations. The TV loads its first preview when its corner is opened. Keyboard keys share an instanced draw, static shadows are refreshed when the device model changes, and touch devices use a lower rendering resolution.
