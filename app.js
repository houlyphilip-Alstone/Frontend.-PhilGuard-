(() => {
  const API_BASE = localStorage.getItem('pg_api_url') || 'http://localhost:4000/v1';

  async function api(path, options={}) {
    const token = localStorage.getItem('pg_access_token');
    const headers = {'Content-Type':'application/json', ...(options.headers||{})};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(API_BASE + path, {...options, headers});
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = {message:text}; }
    if (!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
    return data;
  }

  document.querySelectorAll('form[data-api]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = form.parentElement.querySelector('.status');
      const button = form.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(form).entries());
      if (payload.organisation && payload.name) payload.organisation_name = payload.organisation;
      try {
        button.disabled = true; button.textContent = 'Connecting…';
        const data = await api(form.dataset.api, {method:'POST', body:JSON.stringify(payload)});
        if (data.accessToken || data.token) localStorage.setItem('pg_access_token', data.accessToken || data.token);
        localStorage.setItem('pg_user', JSON.stringify(data.user || {name:payload.name,email:payload.email}));
        status.textContent = 'Success. Redirecting…';
        location.href = form.dataset.redirect || 'dashboard.html';
      } catch (err) {
        status.textContent = err.message;
      } finally { button.disabled = false; button.textContent = form.dataset.api.includes('register') ? 'Create account' : 'Sign in'; }
    });
  });

  document.querySelectorAll('[data-logout]').forEach(btn => btn.addEventListener('click', async () => {
    try { await api('/auth/logout', {method:'POST'}); } catch {}
    localStorage.removeItem('pg_access_token');
    location.href='index.html';
  }));

  if (location.pathname.endsWith('dashboard.html')) {
    api('/dashboard/overview').then(data => {
      const map = {encrypted:data.totalEmailsEncrypted, decrypted:data.totalEmailsDecrypted, requests:data.apiRequestsToday, usage:data.usagePercent};
      Object.entries(map).forEach(([k,v]) => {
        const el=document.querySelector(`[data-stat="${k}"]`);
        if(el && v !== undefined) el.textContent = k==='usage' ? `${v}%` : Number(v).toLocaleString();
      });
    }).catch(() => {});
  }
})();