const SUPABASE_URL = 'https://sblimnidzmxtktregcxq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8kTOYvyG154zRo-JQDuvFQ_VJOAyjMM';
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const nicheQuestions = {
  'Short-form Social Media': ['Preferred platforms?', 'Monthly clip volume?', 'Target retention KPI?'],
  'Wedding & Event Films': ['Style focus?', 'Turnaround SLA?', 'Teaser + full film package?'],
  'Gaming & Esports': ['Game genres?', 'Subtitles/SFX meme style?', 'Upload schedule support?'],
  'Corporate & Brand Videos': ['Industries served?', 'Brand guideline compliance?', 'Revision process?'],
  Documentary: ['Narrative style?', 'Archival handling?', 'Episode/film length range?'],
  'Podcast / YouTube Long-form': ['Multicam workflow?', 'Repurposing shorts?', 'Delivery cadence?'],
  'Real Estate': ['Listing turnaround?', 'Drone integration?', 'Agent branding overlays?'],
  'Music Videos': ['Color treatment style?', 'Performance/narrative split?', 'VFX scope?'],
  Other: ['Ideal clients?', 'Biggest value promise?', 'Unique workflow?']
};

const uploadedVideos = [];

function getProfile() { return JSON.parse(localStorage.getItem('cutcraft_profile') || '{}'); }
function setProfile(v) { localStorage.setItem('cutcraft_profile', JSON.stringify(v)); }
function safe(value) {
  return String(value || '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function renderNicheFocus(niche) {
  const fs = document.getElementById('niche-focus'); if (!fs) return;
  const qs = nicheQuestions[niche] || [];
  fs.innerHTML = qs.length ? '<legend>Niche detail prompts</legend>' : '';
  qs.forEach((q, i) => fs.innerHTML += `<label>${q}<input name="niche_q_${i}"/></label>`);
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  document.getElementById('niche-select').addEventListener('change', (e) => renderNicheFocus(e.target.value));
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(signupForm);
    const email = fd.get('email');
    const password = fd.get('password');
    const { error } = await client.auth.signUp({ email, password });
    const status = document.getElementById('status');
    if (error) { status.textContent = error.message; return; }
    const profile = Object.fromEntries(fd.entries());
    profile.nicheAnswers = Object.keys(profile).filter((k) => k.startsWith('niche_q_')).map((k) => profile[k]);
    setProfile(profile);
    status.textContent = 'Signup successful. Redirecting to dashboard...';
    setTimeout(() => location.href = 'dashboard.html', 900);
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const { error } = await client.auth.signInWithPassword({ email: fd.get('email'), password: fd.get('password') });
    const status = document.getElementById('status');
    if (error) { status.textContent = error.message; return; }
    status.textContent = 'Login successful. Redirecting...';
    setTimeout(() => location.href = 'dashboard.html', 700);
  });
}

function dashboardMarkup(profile) {
  const fullName = safe(profile.fullName || 'Editor');
  const niche = safe(profile.niche || 'Not set');
  const tools = safe(profile.tools || 'Premiere Pro, Resolve, After Effects');
  const experience = safe(profile.experience || 'N/A');
  const positioning = safe(profile.positioning || 'Add your positioning statement to explain who you help, what you edit, and why your work gets results.');
  const focusItems = (profile.nicheAnswers || []).filter(Boolean).map((x) => `<li>${safe(x)}</li>`).join('') || '<li>Add niche specifics in profile settings.</li>';

  return {
    overview: `<section class="dash-hero reveal-up">
      <div><span class="status-pill">Premium workspace</span><h1>${fullName}'s editing command centre</h1><p>Manage your public portfolio, proof points, uploaded videos, client pipeline, settings, and collaborator access from one designed dashboard.</p></div>
      <div class="hero-mini-panel"><strong>Portfolio score</strong><span>94%</span><small>Ready for client review</small></div>
    </section>
    <section class="kpi-grid">
      <article class="kpi metric-card"><span>Primary niche</span><strong>${niche}</strong><small>Portfolio copy adapts to this vertical.</small></article>
      <article class="kpi metric-card"><span>Experience</span><strong>${experience} years</strong><small>Shown on your editor profile.</small></article>
      <article class="kpi metric-card"><span>Tool stack</span><strong>${tools}</strong><small>Displayed as technical proof.</small></article>
      <article class="kpi metric-card"><span>Video slots</span><strong>${uploadedVideos.length + 6}</strong><small>Upload reels, edits, and case studies.</small></article>
    </section>
    <section class="dashboard-grid">
      <article class="panel"><h2>Today’s portfolio checklist</h2><ul class="check-list"><li>Add one flagship video to your portfolio grid.</li><li>Write the problem, edit process, and outcome for a case study.</li><li>Review client permissions before sharing preview links.</li><li>Update availability and service package boundaries.</li></ul></article>
      <article class="panel"><h2>Quick actions</h2><div class="action-grid"><button class="mini-action" data-jump="portfolio">Upload video</button><button class="mini-action" data-jump="projects">Create project</button><button class="mini-action" data-jump="services">Edit services</button><button class="mini-action" data-jump="permissions">Invite reviewer</button></div></article>
    </section>`,

    profile: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Public identity</span><h1>Profile</h1><p>${positioning}</p></div></section>
    <section class="dashboard-grid three">
      <article class="panel"><h2>Editor details</h2><p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${safe(profile.email || 'Not available')}</p><p><strong>Primary niche:</strong> ${niche}</p></article>
      <article class="panel"><h2>Creative stack</h2><p>${tools}</p><p>Use this area to show software, plugins, camera codecs, audio tools, color workflows, and delivery formats.</p></article>
      <article class="panel"><h2>Niche insights</h2><ul>${focusItems}</ul></article>
    </section>`,

    portfolio: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Portfolio builder</span><h1>Upload and arrange your best editing work</h1><p>Add reels, case-study videos, client edits, shorts, trailers, and before/after samples so the dashboard actually feels like a working portfolio.</p></div></section>
    <section class="portfolio-upload panel">
      <div><h2>Upload portfolio videos</h2><p>Select video files from your device to preview them in your portfolio grid. In this static demo, uploads are previewed in-browser for the current session.</p></div>
      <label class="upload-zone" for="video-upload"><span>⬆</span><strong>Drop in video files</strong><small>MP4, MOV, WebM, or any browser-supported video</small><input id="video-upload" type="file" accept="video/*" multiple /></label>
    </section>
    <section class="portfolio-shell">
      <div class="section-heading"><div><span class="status-pill">Featured work</span><h2>Portfolio gallery</h2></div><button class="btn secondary" id="clear-videos" type="button">Clear session uploads</button></div>
      <div class="video-grid" id="video-grid">
        ${sampleVideoCards()}
      </div>
    </section>`,

    projects: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Production tracker</span><h1>Projects</h1><p>Track active edits, deliverables, turnaround promises, feedback rounds, and case-study readiness.</p></div></section>
    <section class="dashboard-grid three"><article class="panel project-card"><span>Active</span><h2>Brand launch cutdown</h2><p>Short-form social campaign with hooks, subtitles, and 9:16 exports.</p></article><article class="panel project-card"><span>Review</span><h2>Wedding highlight film</h2><p>Color pass and final audio polish due before client review.</p></article><article class="panel project-card"><span>Draft</span><h2>YouTube podcast package</h2><p>Long-form edit plus eight shorts for repurposing.</p></article></section>`,

    library: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Asset library</span><h1>Video Library</h1><p>Organize reels, b-roll, thumbnails, deliverables, testimonials, and reusable proof assets.</p></div></section>
    <section class="dashboard-grid three"><article class="panel"><h2>Reels</h2><p>6 hero reels categorized by niche and client objective.</p></article><article class="panel"><h2>Case-study clips</h2><p>12 clips ready to pair with written problem/process/outcome notes.</p></article><article class="panel"><h2>Client testimonials</h2><p>4 testimonial snippets prepared for portfolio sections.</p></article></section>`,

    analytics: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Performance</span><h1>Analytics</h1><p>See how complete and client-ready each portfolio area is before you share it.</p></div></section>
    <section class="kpi-grid"><article class="kpi metric-card"><span>Profile completion</span><strong>86%</strong><small>Needs testimonial links.</small></article><article class="kpi metric-card"><span>Case studies</span><strong>3/5</strong><small>Two more recommended.</small></article><article class="kpi metric-card"><span>Services clarity</span><strong>92%</strong><small>Strong package descriptions.</small></article><article class="kpi metric-card"><span>Permission health</span><strong>100%</strong><small>Roles are separated.</small></article></section>`,

    services: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Offer suite</span><h1>Services</h1><p>Package your editing work so clients instantly understand what they can buy.</p></div></section>
    <section class="dashboard-grid three"><article class="panel"><h2>Hero reel package</h2><p>Best for portfolio refreshes, editors, creators, and high-impact landing pages.</p></article><article class="panel"><h2>Short-form growth package</h2><p>Hooks, captions, pacing, exports, thumbnails, and platform-specific optimization.</p></article><article class="panel"><h2>Long-form authority package</h2><p>Podcast/YouTube edits with retention structure, chaptering, polish, and repurposing.</p></article></section>`,

    inquiries: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Client pipeline</span><h1>Inquiries</h1><p>Prepare the data you need to qualify clients before the first call.</p></div></section>
    <section class="dashboard-grid"><article class="panel"><h2>Lead capture fields</h2><ul class="check-list"><li>Project type and niche</li><li>Deadline and deliverables</li><li>Budget range</li><li>Reference links</li><li>Revision expectations</li></ul></article><article class="panel"><h2>Follow-up templates</h2><p>Use structured responses for discovery calls, footage requirements, revision policies, and final delivery terms.</p></article></section>`,

    settings: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Workspace control</span><h1>Settings</h1><p>Configure account preferences, public portfolio options, availability, sharing rules, and brand details.</p></div></section>
    <section class="dashboard-grid three"><article class="panel"><h2>Brand settings</h2><p>Logo, colors, social links, bio, and public profile slug.</p></article><article class="panel"><h2>Availability</h2><p>Booking windows, rush availability, project capacity, and response times.</p></article><article class="panel"><h2>Visibility</h2><p>Choose which case studies, uploaded videos, and testimonials are public.</p></article></section>`,

    permissions: `<section class="dash-hero compact reveal-up"><div><span class="status-pill">Collaboration</span><h1>Editor Permissions</h1><p>Define collaborator roles and access boundaries for multi-editor workflows.</p></div></section>
    <section class="dashboard-grid two"><article class="panel permission-card"><h2>Owner</h2><p>Full control over profile, portfolio, settings, analytics, and billing decisions.</p></article><article class="panel permission-card"><h2>Senior Editor</h2><p>Can edit case studies, video descriptions, service structure, and project notes.</p></article><article class="panel permission-card"><h2>Assistant Editor</h2><p>Can upload assets, draft descriptions, tag videos, and prep project galleries.</p></article><article class="panel permission-card"><h2>Reviewer / Client</h2><p>Read-only feedback access on selected projects and private preview links.</p></article></section>`
  };
}

function sampleVideoCards() {
  const samples = [
    ['Social ad cutdown', '9:16 paid social edit with hook testing and captions', 'Short-form'],
    ['Wedding highlight film', 'Cinematic story sequence with color and audio polish', 'Wedding'],
    ['Podcast authority edit', 'Long-form episode plus repurposed clips', 'YouTube']
  ];
  return samples.map(([title, description, tag]) => `<article class="video-card sample-card"><div class="video-frame"><span>▶</span><small>${tag}</small></div><div><h3>${title}</h3><p>${description}</p></div></article>`).join('');
}

function renderUploadedVideos() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;
  const uploaded = uploadedVideos.map((video, index) => `<article class="video-card"><video src="${video.url}" controls muted playsinline></video><div><h3>${safe(video.name)}</h3><p>${safe(video.size)} · Session upload #${index + 1}</p></div></article>`).join('');
  grid.innerHTML = uploaded + sampleVideoCards();
}

function bindDashboardView(active) {
  document.querySelectorAll('.mini-action').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.jump;
      document.querySelector(`.tab[data-tab="${target}"]`)?.click();
    });
  });

  if (active !== 'portfolio') return;
  const upload = document.getElementById('video-upload');
  const clear = document.getElementById('clear-videos');
  upload?.addEventListener('change', (event) => {
    Array.from(event.target.files || []).forEach((file) => {
      uploadedVideos.unshift({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: URL.createObjectURL(file)
      });
    });
    renderUploadedVideos();
  });
  clear?.addEventListener('click', () => {
    uploadedVideos.splice(0).forEach((video) => URL.revokeObjectURL(video.url));
    renderUploadedVideos();
  });
  renderUploadedVideos();
}

const dashboard = document.getElementById('dashboard');
if (dashboard) {
  client.auth.getSession().then(({ data }) => {
    if (!data.session) location.href = 'login.html';
  });
  const profile = getProfile();
  const views = dashboardMarkup(profile);
  let active = 'overview';
  const render = () => {
    dashboard.innerHTML = views[active];
    bindDashboardView(active);
  };
  render();

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      active = tab.dataset.tab;
      render();
    });
  });

  document.getElementById('logout').addEventListener('click', async () => {
    await client.auth.signOut();
    location.href = 'index.html';
  });
}
