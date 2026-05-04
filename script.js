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

function getProfile() { return JSON.parse(localStorage.getItem('cutcraft_profile') || '{}'); }
function setProfile(v) { localStorage.setItem('cutcraft_profile', JSON.stringify(v)); }

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
  const focusItems = (profile.nicheAnswers || []).filter(Boolean).map((x) => `<li>${x}</li>`).join('') || '<li>Add niche specifics in profile settings.</li>';
  return {
    overview: `<section class="panel"><h1>${profile.fullName || 'Editor'} Dashboard</h1><p>Welcome back. Manage your niche portfolio, account settings, and collaborator permissions from one workspace.</p></section>
    <section class="panel"><h2>At-a-glance</h2><div class="kpi-grid"><div class="kpi"><strong>Niche</strong><div>${profile.niche || 'Not set'}</div></div><div class="kpi"><strong>Experience</strong><div>${profile.experience || 'N/A'} years</div></div><div class="kpi"><strong>Stack</strong><div>${profile.tools || 'Not set'}</div></div><div class="kpi"><strong>Status</strong><div>Client-ready profile</div></div></div></section>`,
    profile: `<section class="panel"><h2>Profile</h2><p><strong>Positioning:</strong> ${profile.positioning || 'Add your positioning statement.'}</p><p><strong>Email:</strong> ${profile.email || 'Not available'}</p><p><strong>Primary Niche:</strong> ${profile.niche || 'Not set'}</p><h3>Niche Insights</h3><ul>${focusItems}</ul></section>`,
    portfolio: `<section class="panel"><h2>Portfolio Planner</h2><ul><li>Hero reel and niche-specific intro</li><li>3 flagship case studies with measurable outcomes</li><li>Process timeline: intake, rough cut, revision, final delivery</li><li>Service cards: subtitles, color, pacing, motion graphics, optimization</li><li>Client fit criteria and package boundaries</li></ul></section>`,
    settings: `<section class="panel"><h2>Settings</h2><p>Configure account preferences, update public profile details, and maintain your editor brand consistency.</p><ul><li>Notification preference center</li><li>Availability windows</li><li>Rate card visibility</li><li>Public link controls</li></ul></section>`,
    permissions: `<section class="panel"><h2>Editor Permissions</h2><p>Define collaborator roles and access boundaries for multi-editor workflows.</p><ul><li><strong>Owner:</strong> Full control over profile, portfolio, and billing decisions.</li><li><strong>Senior Editor:</strong> Can edit case studies and service structure.</li><li><strong>Assistant Editor:</strong> Can upload assets and draft descriptions.</li><li><strong>Reviewer/Client:</strong> Read-only feedback access on specific projects.</li></ul></section>`
  };
}

const dashboard = document.getElementById('dashboard');
if (dashboard) {
  client.auth.getSession().then(({ data }) => {
    if (!data.session) location.href = 'login.html';
  });
  const profile = getProfile();
  const views = dashboardMarkup(profile);
  let active = 'overview';
  const render = () => dashboard.innerHTML = views[active];
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
