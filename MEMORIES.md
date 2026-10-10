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
