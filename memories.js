// Edit these cards to add your own photos and stories. See MEMORIES.md.
// Empty image paths intentionally show labeled placeholders, not invented events.
window.portfolioBoards = [
  {
    id: 'events', title: 'Events & hackathons', kicker: '02 / OUTSIDE THE COMFORT ZONE',
    intro: 'The people, late nights, and things built together. Click a pinned photo to read its story.',
    cards: [
      { title: 'Your next hackathon story', image: '', alt: '', date: '', location: '', role: '', style: 'pinned', description: 'Placeholder — add a hackathon you joined, your team, the problem you tackled, and what you built or learned.' },
      { title: 'An event worth remembering', image: '', alt: '', date: '', location: '', role: '', style: 'taped', description: 'Placeholder — replace this card with a conference, competition, or community event. Add a photo and tell the story behind it.' },
      { title: 'People I built with', image: '', alt: '', date: '', location: '', role: '', style: 'pinned', description: 'Placeholder — a space for a team photo, a shared milestone, or a memorable moment from an event.' }
    ]
  },
  {
    id: 'experience', title: 'Work & experience', kicker: '03 / LEARNING BY DOING',
    intro: 'A corner for the roles, collaborations, and real-world lessons along the way.',
    cards: [
      { title: 'A role to remember', image: '', alt: '', date: '', location: '', role: '', style: 'taped', description: 'Placeholder — add a job, internship, or freelance role. Describe your responsibilities and the work you contributed.' },
      { title: 'Behind the work', image: '', alt: '', date: '', location: '', role: '', style: 'pinned', description: 'Placeholder — share a work-in-progress photo or screenshot, the challenge you faced, and how you approached it.' },
      { title: 'A milestone', image: '', alt: '', date: '', location: '', role: '', style: 'taped', description: 'Placeholder — add a professional milestone, a collaboration, or a lesson you want to remember.' }
    ]
  },
  {
    id: 'school', title: 'School days', kicker: '04 / WHERE IT ALL STARTED',
    intro: 'Projects, classmates, and little moments from the learning years.',
    cards: [
      { title: 'Beyond the classroom', image: '', alt: '', date: '', location: '', role: '', style: 'pinned', description: 'Placeholder — add a school activity, organization, or classroom experience and explain what made it meaningful.' },
      { title: 'Something we made', image: '', alt: '', date: '', location: '', role: '', style: 'taped', description: 'Placeholder — share a school project, your contribution, and what you learned while making it.' },
      { title: 'The people along the way', image: '', alt: '', date: '', location: '', role: '', style: 'pinned', description: 'Placeholder — add a photo with classmates or a school memory you would like visitors to see.' }
    ]
  }
];

// The room has four destinations: the computer plus these three objects.
const originalStories = window.portfolioBoards;
window.portfolioBoards = [
  {
    id: 'events', kind: 'board', title: 'The bulletin board', kicker: '02 / MOMENTS & EXPERIENCES',
    intro: 'Events, hackathons, work, and school memories. Every pinned photo has a story.',
    cards: originalStories.flatMap(section => section.cards.slice(0, 2).map(card => ({...card, category: section.title})))
  },
  {
    id: 'certificates', kind: 'cabinet', title: 'The certificate cabinet', kicker: '03 / FILED ALONG THE WAY',
    intro: 'Open a drawer to view a certificate, its issuer, and the story behind it.',
    cards: [
      {title: 'Courses & training', image: '', description: 'Placeholder ? add a course certificate, the issuing organization, completion date, and what you learned.', role: 'Certificate placeholder', linkLabel: 'View certificate'},
      {title: 'Competitions & awards', image: '', description: 'Placeholder ? add a certificate or award from a competition. Include the event, date, and recognition received.', role: 'Certificate placeholder', linkLabel: 'View certificate'},
      {title: 'Participation & community', image: '', description: 'Placeholder ? add a participation or volunteer certificate and the experience it represents.', role: 'Certificate placeholder', linkLabel: 'View certificate'}
    ]
  },
  {
    id: 'projects', kind: 'tv', title: 'The project channel', kicker: '04 / NOW SHOWING',
    intro: 'Pick a channel or click the TV screen. Explore a project and open its repository or project files.',
    cards: [
      {title: 'Kalye Corazon', image: 'assets/kalye/kalyeSc.png', alt: 'Kalye Corazon game screenshot', description: 'A pixel-art game set in the streets of Iloilo, bringing local culture and places into a playable world.', role: 'Game development', url: 'https://github.com/Ethanolbicarbonate/Kalye-Corazon.git', linkLabel: 'View repository', detailUrl: 'projects/kalye-corazon.html'},
      {title: 'AlgoRHYTHM', image: 'assets/iseet/algorhythm1.png', alt: 'AlgoRHYTHM game screenshot', description: 'A rhythm game built with Python and Pygame, challenging players to time their actions to music.', role: 'Python / Pygame', url: 'https://github.com/sky1rk/iSEE-T.git', linkLabel: 'View repository', detailUrl: 'projects/iseet.html'},
      {title: 'F1 + X', image: 'assets/f1x/pic1.png', alt: 'F1 + X application screenshot', description: 'A laundromat application for managing laundry needs, tracking orders, and scheduling pickups and deliveries.', role: 'Web development', url: 'https://github.com/sky1rk/F1-X.git', linkLabel: 'View repository', detailUrl: 'projects/f1x.html'},
      {title: 'WVSolutions', image: 'assets/wvsu/image.png', alt: 'WVSolutions marketplace screenshot', description: 'A campus marketplace connecting students and staff to buy, sell, and trade goods and services.', role: 'Web development', url: 'https://drive.google.com/drive/folders/1nP6h4edz6t5nsi16jt5l7McaESGLknxt', linkLabel: 'Open project files', detailUrl: 'projects/wvsolutions.html'}
    ]
  }
];
