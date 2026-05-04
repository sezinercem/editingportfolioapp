const nicheQuestions = {
  "Short-form Social Media": ["Preferred platforms (TikTok, Reels, Shorts)?", "Average hook retention target (%)?", "Typical clips produced per week?"],
  "Wedding & Event Films": ["Preferred style (cinematic, documentary, hybrid)?", "Average turnaround time?", "Do you offer teaser reels?"],
  "Gaming & Esports": ["Game genres you specialize in?", "Do you do meme edits/subtitles/SFX?", "Preferred pacing style?"],
  "Corporate & Brand Videos": ["Industries you serve?", "Do you work with brand kits?", "Do you provide revision SLAs?"],
  "Documentary": ["Storytelling style and tone?", "Archival footage handling experience?", "Typical project length?"],
  "Podcast / YouTube Long-form": ["Do you handle multicam syncing?", "Do you create short clips from long content?", "Average episode length edited?"],
  "Real Estate": ["Drone + walkthrough editing?", "Turnaround time for listing videos?", "Do you include motion graphics/maps?"],
  "Music Videos": ["Performance vs narrative ratio?", "Color grade signature?", "VFX/compositing included?"],
  "Other": ["Who is your ideal client?", "What results do your edits drive?", "What editing workflow is unique to you?"]
};

function renderNicheFocus(niche) {
  const fs = document.getElementById('niche-focus');
  if (!fs) return;
  const questions = nicheQuestions[niche] || [];
  fs.innerHTML = questions.length ? `<legend>Niche-Specific Profiling</legend>` : '';
  questions.forEach((q, i) => {
    fs.innerHTML += `<label>${q}<input name="niche_q_${i}" placeholder="Your answer" /></label>`;
  });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  document.getElementById('niche-select').addEventListener('change', e => renderNicheFocus(e.target.value));
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(signupForm);
    const user = Object.fromEntries(fd.entries());
    user.nicheAnswers = Object.keys(user).filter(k => k.startsWith('niche_q_')).map(k => user[k]);
    localStorage.setItem('cutcraft_user', JSON.stringify(user));
    document.getElementById('status').textContent = 'Account created! Redirecting to your dashboard...';
    setTimeout(() => location.href = 'dashboard.html', 800);
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const saved = JSON.parse(localStorage.getItem('cutcraft_user') || '{}');
    if (fd.get('email') === saved.email && fd.get('password') === saved.password) {
      document.getElementById('status').textContent = 'Login successful!';
      setTimeout(() => location.href = 'dashboard.html', 500);
    } else {
      document.getElementById('status').textContent = 'Invalid credentials. Try again or sign up.';
    }
  });
}

const dashboard = document.getElementById('dashboard');
if (dashboard) {
  const user = JSON.parse(localStorage.getItem('cutcraft_user') || 'null');
  if (!user) location.href = 'login.html';
  const focus = (user.nicheAnswers || []).filter(Boolean).map(v => `<li>${v}</li>`).join('') || '<li>Add niche details from signup to enrich your profile.</li>';
  dashboard.innerHTML = `
    <section class="panel">
      <h1>${user.fullName || 'Editor'} — ${user.niche || 'Generalist'} Portfolio</h1>
      <p>${user.positioning || 'Add a positioning statement that explains who you help and the outcomes your edits create.'}</p>
    </section>

    <section class="panel">
      <h2>Professional Snapshot</h2>
      <div class="kpi-grid">
        <article class="kpi"><strong>Experience</strong><div>${user.experience || 'N/A'} years</div></article>
        <article class="kpi"><strong>Tool Stack</strong><div>${user.tools || 'Not provided'}</div></article>
        <article class="kpi"><strong>Niche</strong><div>${user.niche || 'Not provided'}</div></article>
        <article class="kpi"><strong>Delivery Promise</strong><div>Structured revisions + clear timelines</div></article>
      </div>
    </section>

    <section class="panel">
      <h2>Niche Positioning Insights</h2>
      <ul>${focus}</ul>
    </section>

    <section class="panel">
      <h2>Detailed Portfolio Layout (Auto-generated)</h2>
      <ul>
        <li><strong>Hero Reel Section:</strong> Signature projects with niche-tailored framing.</li>
        <li><strong>Case Studies:</strong> Problem, edit process, creative decisions, outcome metrics.</li>
        <li><strong>Workflow Breakdown:</strong> Intake, rough cut, feedback loop, final delivery.</li>
        <li><strong>Specialized Service Cards:</strong> Platform optimization, subtitles, color, sound, pacing, motion graphics.</li>
        <li><strong>Client Fit Filter:</strong> Ideal client profile, budget range, timeline expectations.</li>
      </ul>
    </section>
  `;

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('cutcraft_user');
    location.href = 'index.html';
  });
}
