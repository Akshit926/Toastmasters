// ── Config ───────────────────────────────────────────────────────────────────
const API       = 'http://localhost:5001/api/club-members';
const ROLES_API = 'http://localhost:5001/api/roles';

// ── State ─────────────────────────────────────────────────────────────────────
let allMembers  = [];
let allRoles    = [];
let editingId   = null;
let roleTab     = 'all';

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { loadMembers(); });

// ── Section Navigation ────────────────────────────────────────────────────────
function showSection(name, el) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`section-${name}`).classList.add('active');
    if (el) el.classList.add('active');
    const titles = { 'members': 'Member Management', 'roles': 'Role Requests & Approvals' };
    document.getElementById('page-title').textContent = titles[name] || 'Dashboard';
    if (name === 'roles') loadRoles();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ─────────────────────────────────────────────────────────────────────────────
//  MEMBERS TAB
// ─────────────────────────────────────────────────────────────────────────────

async function loadMembers() {
    const tbody = document.getElementById('members-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Loading…</td></tr>';
    try {
        const res  = await fetch(API);
        allMembers = await res.json();
        renderTable(allMembers);
        updateStats(allMembers);
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-row" style="color:var(--danger)">
            ⚠ Could not connect to server. Is the backend running on port 5000?</td></tr>`;
    }
}

function renderTable(members) {
    const tbody = document.getElementById('members-tbody');
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading-row">No members found.</td></tr>';
        return;
    }
    tbody.innerHTML = members.map((m, i) => `
        <tr>
            <td class="row-num">${i + 1}</td>
            <td><span class="cid-badge">${esc(m.customer_id)}</span></td>
            <td><strong>${esc(m.member_name)}</strong></td>
            <td class="date-text">${fmtDate(m.created_at)}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-edit"   title="Edit"   onclick="openEditModal(${m.id},'${esc(m.customer_id)}','${esc(m.member_name)}')">✏</button>
                    <button class="btn-icon btn-delete" title="Delete" onclick="deleteMember(${m.id},'${esc(m.member_name)}')">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

function updateStats(members) {
    document.getElementById('stat-total').textContent = members.length;
    document.getElementById('stat-ids').textContent   = members.length;
    document.getElementById('member-chip').textContent = `${members.length} Members`;
    if (members.length > 0) {
        const newest = [...members].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
        document.getElementById('stat-new').textContent = newest.member_name.split(' ')[0];
    }
}

function filterMembers() {
    const q = document.getElementById('search-input').value.toLowerCase().trim();
    renderTable(q ? allMembers.filter(m =>
        m.member_name.toLowerCase().includes(q) || m.customer_id.toLowerCase().includes(q)
    ) : allMembers);
}

// ── Add/Edit Modal ────────────────────────────────────────────────────────────
function openAddModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Add New Member';
    document.getElementById('save-btn').textContent    = 'Add Member';
    document.getElementById('input-cid').value         = '';
    document.getElementById('input-name').value        = '';
    document.getElementById('edit-id').value           = '';
    hideModalError();
    document.getElementById('modal-overlay').classList.add('open');
    setTimeout(() => document.getElementById('input-cid').focus(), 100);
}

function openEditModal(id, customerId, memberName) {
    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Member';
    document.getElementById('save-btn').textContent    = 'Save Changes';
    document.getElementById('edit-id').value           = id;
    document.getElementById('input-cid').value         = customerId;
    document.getElementById('input-name').value        = memberName;
    hideModalError();
    document.getElementById('modal-overlay').classList.add('open');
    setTimeout(() => document.getElementById('input-name').focus(), 100);
}

function closeModal(e) {
    if (e && e.target !== document.getElementById('modal-overlay')) return;
    document.getElementById('modal-overlay').classList.remove('open');
}

function hideModalError() {
    const el = document.getElementById('modal-err');
    el.style.display = 'none'; el.textContent = '';
}
function showModalError(msg) {
    const el = document.getElementById('modal-err');
    el.textContent = msg; el.style.display = 'block';
}

async function saveMember() {
    const customerId = document.getElementById('input-cid').value.trim();
    const memberName = document.getElementById('input-name').value.trim();
    const id         = document.getElementById('edit-id').value;
    const btn        = document.getElementById('save-btn');

    if (!customerId || !memberName) { showModalError('Both fields are required.'); return; }

    btn.disabled = true; btn.textContent = 'Saving…';
    hideModalError();

    try {
        const res = await fetch(editingId ? `${API}/${id}` : API, {
            method:  editingId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ customer_id: customerId, member_name: memberName })
        });
        const data = await res.json();
        if (!res.ok) { showModalError(data.error || 'An error occurred.'); }
        else { closeModal(null); showToast(editingId ? '✅ Member updated!' : '✅ Member added!', 'ok'); loadMembers(); }
    } catch { showModalError('Network error — is the server running?'); }
    finally { btn.disabled = false; btn.textContent = editingId ? 'Save Changes' : 'Add Member'; }
}

async function deleteMember(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
        const res  = await fetch(`${API}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) showToast(data.error || 'Delete failed.', 'error');
        else { showToast(`🗑 ${name} removed.`, 'success'); loadMembers(); }
    } catch { showToast('Network error.', 'error'); }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROLES TAB
// ─────────────────────────────────────────────────────────────────────────────

async function loadRoles() {
    const tbody = document.getElementById('roles-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Loading roles…</td></tr>';
    try {
        const res = await fetch(`${ROLES_API}/all`);
        allRoles  = await res.json();

        const pending = allRoles.filter(r =>
            r.status === 'Pending_Allocation' || r.status === 'Pending_Cancel'
        ).length;

        const dot   = document.getElementById('pending-dot');
        const chip  = document.getElementById('pending-chip');
        dot.style.display  = pending > 0 ? 'block' : 'none';
        chip.textContent   = pending;
        chip.style.display = pending > 0 ? 'inline-flex' : 'none';

        renderRolesTable();
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row" style="color:var(--danger)">⚠ Could not load roles. Is the server running?</td></tr>`;
    }
}

function switchTab(tab) {
    roleTab = tab;
    document.getElementById('tab-all').classList.toggle('active',     tab === 'all');
    document.getElementById('tab-pending').classList.toggle('active', tab === 'pending');
    renderRolesTable();
}

function filterRoles() {
    renderRolesTable();
}

function renderRolesTable() {
    const tbody = document.getElementById('roles-tbody');
    const q     = (document.getElementById('roles-search')?.value || '').toLowerCase().trim();
    let rows = roleTab === 'pending'
        ? allRoles.filter(r => r.status === 'Pending_Allocation' || r.status === 'Pending_Cancel')
        : allRoles;
    if (q) rows = rows.filter(r =>
        (r.member_name || '').toLowerCase().includes(q) ||
        (r.role_name   || '').toLowerCase().includes(q) ||
        (r.customer_id || '').toLowerCase().includes(q)
    );
    if (rows.length === 0) {
        const msg = roleTab === 'pending' ? 'No pending requests — all caught up! ✅' : 'No role assignments found.';
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row">${msg}</td></tr>`;
        return;
    }
    tbody.innerHTML = rows.map(r => {
        const { cls, lbl } = statusInfo(r.status);
        return `<tr>
            <td><strong>${esc(r.member_name || '—')}</strong></td>
            <td>${r.customer_id ? `<span class="cid-pill">${esc(r.customer_id)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
            <td>${esc(r.role_name || '—')}</td>
            <td class="date-txt">${r.meeting_date ? fmtDateSat(r.meeting_date) : '—'}</td>
            <td><span class="status-pill ${cls}">${lbl}</span></td>
            <td><div class="act-cell">${buildRoleActions(r)}</div></td>
        </tr>`;
    }).join('');
}

function buildRoleActions(r) {
    const d = encodeDate(r.meeting_date);
    if (r.status === 'Pending_Allocation') return `
        <button class="btn-approve" onclick="approveAllocation(${r.member_id},${r.role_id},'${d}',this)">✓ Approve</button>
        <button class="btn-reject"  onclick="rejectAllocation(${r.member_id},${r.role_id},'${d}','${esc(r.member_name)}',this)">✕ Reject</button>`;
    if (r.status === 'Pending_Cancel') return `
        <button class="btn-approve" onclick="approveCancel(${r.member_id},${r.role_id},'${d}',this)">✓ Confirm Cancel</button>
        <button class="btn-reject"  onclick="denyCancel(${r.member_id},${r.role_id},'${d}','${esc(r.member_name)}',this)">✕ Keep Role</button>`;
    if (r.status === 'Assigned') return `
        <button class="btn-reject" onclick="forceCancel(${r.member_id},${r.role_id},'${d}','${esc(r.member_name)}','${esc(r.role_name)}',this)">Force Cancel</button>`;
    return '—';
}

// ── Approve role allocation (Pending_Allocation → Assigned) ───────────────────
async function approveAllocation(memberId, roleId, date, btn) {
    btn.disabled = true; btn.textContent = '…';
    try {
        const res = await fetch(`${ROLES_API}/approve-allocate`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ member_id: memberId, role_id: roleId, meeting_date: date })
        });
        const data = await res.json();
        if (res.ok) { showToast('✅ Role allocation approved!', 'success'); loadRoles(); }
        else        { showToast(data.error || 'Approval failed.', 'error'); btn.disabled = false; btn.textContent = '✓ Approve'; }
    } catch { showToast('Network error.', 'error'); btn.disabled = false; btn.textContent = '✓ Approve'; }
}

// ── Reject allocation (Pending_Allocation → Cancelled) ───────────────────────
async function rejectAllocation(memberId, roleId, date, name, btn) {
    showConfirm(`Reject role allocation for <strong>${name}</strong>?<br>This will mark the request as Cancelled.`,
        async () => {
            try {
                const res = await fetch(`${ROLES_API}/approve-cancel`, {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ member_id: memberId, role_id: roleId, meeting_date: date })
                });
                if (res.ok) { showToast('🗑 Allocation rejected.', 'success'); loadRoles(); }
                else        { showToast('Rejection failed.', 'error'); }
            } catch { showToast('Network error.', 'error'); }
        }
    );
}

// ── Approve cancellation (Pending_Cancel → Cancelled) ───────────────────────
async function approveCancel(memberId, roleId, date, btn) {
    btn.disabled = true; btn.textContent = '…';
    try {
        const res = await fetch(`${ROLES_API}/approve-cancel`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ member_id: memberId, role_id: roleId, meeting_date: date })
        });
        const data = await res.json();
        if (res.ok) { showToast('✅ Cancellation confirmed!', 'success'); loadRoles(); }
        else        { showToast(data.error || 'Failed.', 'error'); btn.disabled = false; btn.textContent = '✓ Confirm Cancel'; }
    } catch { showToast('Network error.', 'error'); btn.disabled = false; btn.textContent = '✓ Confirm Cancel'; }
}

// ── Deny cancel (Pending_Cancel → Assigned, keep the role) ──────────────────
async function denyCancel(memberId, roleId, date, name, btn) {
    showConfirm(`Keep the role assigned to <strong>${name}</strong>? Their cancellation request will be denied.`,
        async () => {
            try {
                const res = await fetch(`${ROLES_API}/approve-allocate`, {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ member_id: memberId, role_id: roleId, meeting_date: date })
                });
                if (res.ok) { showToast('✅ Cancellation denied — role kept.', 'success'); loadRoles(); }
                else        { showToast('Failed.', 'error'); }
            } catch { showToast('Network error.', 'error'); }
        }
    );
}

// ── Force cancel (Assigned → Cancelled, admin override) ─────────────────────
async function forceCancel(memberId, roleId, date, name, roleName, btn) {
    showConfirm(`Force-cancel <strong>${roleName}</strong> for <strong>${name}</strong>?<br>This will immediately mark it as Cancelled.`,
        async () => {
            try {
                const res = await fetch(`${ROLES_API}/approve-cancel`, {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ member_id: memberId, role_id: roleId, meeting_date: date })
                });
                if (res.ok) { showToast('🗑 Role force-cancelled.', 'success'); loadRoles(); }
                else        { showToast('Failed.', 'error'); }
            } catch { showToast('Network error.', 'error'); }
        }
    );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
let confirmCallback = null;

function showConfirm(message, onConfirm) {
    confirmCallback = onConfirm;
    document.getElementById('confirm-message').innerHTML = message;
    document.getElementById('confirm-overlay').classList.add('open');
    document.getElementById('confirm-ok-btn').onclick = async () => {
        closeConfirm(null);
        await confirmCallback();
    };
}

function closeConfirm(e) {
    if (e && e.target !== document.getElementById('confirm-overlay')) return;
    document.getElementById('confirm-overlay').classList.remove('open');
    confirmCallback = null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusInfo(status) {
    const map = {
        'Assigned':           { cls: 's-assigned',  lbl: 'Assigned' },
        'Pending_Allocation': { cls: 's-pending',   lbl: 'Pending Approval' },
        'Pending_Cancel':     { cls: 's-pending',   lbl: 'Cancel Requested' },
        'Cancelled':          { cls: 's-cancelled', lbl: 'Cancelled' },
    };
    return map[status] || { cls: 's-pending', lbl: status || '—' };
}

function encodeDate(dateStr) {
    if (!dateStr) return '';
    return String(dateStr).split('T')[0];
}

// Fix: parse date without timezone conversion (avoids Friday instead of Saturday bug)
function fmtDate(str) {
    if (!str) return '—';
    const s = String(str).split('T')[0]; // yyyy-mm-dd
    const [y, m, d] = s.split('-').map(Number);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d).padStart(2,'0')} ${months[m-1]} ${y}`;
}

// Same as fmtDate — used to show meeting date (Saturday)
function fmtDateSat(str) { return fmtDate(str); }

function esc(str) {
    return String(str || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3500);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(null); closeConfirm(null); }
});
