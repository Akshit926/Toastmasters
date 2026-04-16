/* roles.js */
const DEFAULT_ROLES = [
    { id: 'tmod', title: 'Toastmaster of the Day' },
    { id: 'ttm', title: 'Table Topics Master' },
    { id: 'ge', title: 'General Evaluator' },
    { id: 'ah', title: 'Ah-Counter' },
    { id: 'timer', title: 'Timer' },
    { id: 'grammarian', title: 'Grammarian' },
    { id: 'speaker1', title: 'Speaker 1' },
    { id: 'speaker2', title: 'Speaker 2' },
    { id: 'speaker3', title: 'Speaker 3' },
    { id: 'speaker4', title: 'Speaker 4' },
    { id: 'evaluator1', title: 'Evaluator 1' },
    { id: 'evaluator2', title: 'Evaluator 2' },
    { id: 'evaluator3', title: 'Evaluator 3' },
    { id: 'evaluator4', title: 'Evaluator 4' }
];

function getNextFourSaturdays() {
    let dates = [];
    let d = new Date();
    d.setDate(d.getDate() + (6 - d.getDay() + 7) % 7);
    if (d.getDay() !== 6) d.setDate(d.getDate() + 6 - d.getDay());

    for (let i = 0; i < 4; i++) {
        dates.push(d.toISOString().split('T')[0]);
        d.setDate(d.getDate() + 7);
    }
    return dates;
}

function formatDateString(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

function initMockDatabase() {
    let rawData = localStorage.getItem('tm_meetings_data');
    if (!rawData) {
        const dates = getNextFourSaturdays();
        let db = {};
        dates.forEach(date => {
            let meetingRoles = {};
            DEFAULT_ROLES.forEach(r => {
                meetingRoles[r.id] = { title: r.title, member: null, allocatePending: false, cancelPending: false, cancelReason: '' };
            });
            db[date] = meetingRoles;
        });
        localStorage.setItem('tm_meetings_data', JSON.stringify(db));
        return db;
    }
    
    let db = JSON.parse(rawData);
    Object.keys(db).forEach(date => {
        let roles = db[date];
        DEFAULT_ROLES.forEach(r => {
            if (!roles[r.id]) {
                roles[r.id] = { title: r.title, member: null, allocatePending: false, cancelPending: false, cancelReason: '' };
            }
            if (roles[r.id].member === '') roles[r.id].member = null;
            if (roles[r.id].allocatePending === undefined) roles[r.id].allocatePending = false;
            if (roles[r.id].cancelPending === undefined) roles[r.id].cancelPending = false;
            if (roles[r.id].cancelReason === undefined) roles[r.id].cancelReason = '';
        });
    });
    return db;
}

let database = initMockDatabase();
let currentMeetingDate = Object.keys(database)[0];

document.addEventListener('DOMContentLoaded', () => {
    populateDateDropdown();
    loadRolesForMeeting();
});

function populateDateDropdown() {
    const dropdown = document.getElementById('meetingDate');
    dropdown.innerHTML = '';
    Object.keys(database).forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = formatDateString(date);
        dropdown.appendChild(option);
    });
    dropdown.value = currentMeetingDate;
}

function loadRolesForMeeting() {
    const dropdown = document.getElementById('meetingDate');
    currentMeetingDate = dropdown.value;
    renderDashboard(database[currentMeetingDate]);
}

function renderDashboard(rolesData) {
    const dashboard = document.getElementById('rolesDashboard');
    dashboard.innerHTML = '';

    DEFAULT_ROLES.forEach(dr => {
        const role = { id: dr.id, ...rolesData[dr.id] };
        const currentMember = role.member ? role.member : null;
        
        const isCancelPending = role.cancelPending;
        const isAllocatePending = role.allocatePending;
        const hasMember = currentMember !== null;
        
        // Status Class Engine
        let statusClass = 'status-available';
        if (hasMember) statusClass = (isCancelPending || isAllocatePending) ? 'status-pending' : 'status-taken';

        const card = document.createElement('div');
        card.className = `role-card ${statusClass}`;
        
        // HTML Badge
        let badgeHTML = `<span class="role-status-badge">Available</span>`;
        if (isAllocatePending) {
            badgeHTML = `<span class="role-status-badge pending-badge">Approval Pending</span>`;
        } else if (hasMember && !isCancelPending) {
            badgeHTML = `<span class="role-status-badge taken-badge">Taken</span>`;
        } else if (hasMember && isCancelPending) {
            badgeHTML = `<span class="role-status-badge pending-badge">Cancel Requested</span>`;
        }
            
        // Member Data Section
        let memberHTML = `<p style="color: var(--text-muted, #666); font-style: italic;">No one assigned yet</p>`;
        if (hasMember) {
            memberHTML = `
                <div class="allocated-member ${(isCancelPending || isAllocatePending) ? 'pending-member' : ''}">
                    <div class="member-avatar">${currentMember.charAt(0).toUpperCase()}</div>
                    <span>${currentMember}</span>
                </div>
            `;
            if (isCancelPending) memberHTML += `<p class="cancel-reason">Reason: ${role.cancelReason}</p>`;
        }

        // Buttons and modal triggers
        let actionsHTML = `<button class="btn-card btn-claim" onclick="openModal('claim', '${role.id}', '${role.title}')">Claim Role</button>`;
        if (isAllocatePending) {
            actionsHTML = `<p style="font-size:0.8rem; flex:1; text-align:center; color: var(--text-light, #888);">Waiting for Admin Approval via Email</p>`;
        } else if (hasMember) {
             if (isCancelPending) {
                 actionsHTML = `<p style="font-size:0.8rem; flex:1; text-align:center; color: var(--text-light, #888);">Waiting for Admin Cancel via Email</p>`;
             } else {
                 actionsHTML = `<button class="btn-card btn-cancel" onclick="openModal('cancel', '${role.id}', '${role.title}', '${role.member}')">Request Cancel</button>`;
             }
        }

        card.innerHTML = `
            <div class="role-header"><div class="role-title">${role.title}</div>${badgeHTML}</div>
            <div class="role-body">${memberHTML}</div>
            <div class="role-footer">${actionsHTML}</div>
        `;
        dashboard.appendChild(card);
    });
}

function openModal(actionType, roleId, roleTitle, currentMember = '') {
    const modal = document.getElementById('roleModal');
    document.getElementById('actionForm').reset();

    document.getElementById('modalRoleName').textContent = roleTitle;
    document.getElementById('modalActionType').value = actionType;
    document.getElementById('modalRoleId').value = roleId;

    const titleEl = document.getElementById('modalTitle');
    const memberNameInput = document.getElementById('memberName');
    const submitBtn = document.getElementById('modalSubmitBtn');

    if (actionType === 'claim') {
        titleEl.textContent = 'Claim Role';
        document.querySelector('label[for="memberName"]').textContent = 'Your Name';
        memberNameInput.placeholder = 'e.g. John Doe';
        submitBtn.textContent = 'Confirm Claim';
        submitBtn.style.background = 'var(--blue)';
    } else if (actionType === 'cancel') {
        titleEl.textContent = 'Cancel Role?';
        document.querySelector('label[for="memberName"]').textContent = 'Reason for cancellation';
        memberNameInput.placeholder = 'e.g. Unwell, Out of town';
        submitBtn.textContent = 'Request Cancellation';
        submitBtn.style.background = 'var(--maroon)';
    }
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('roleModal').classList.remove('active');
}

document.getElementById('roleModal').addEventListener('click', (e) => {
    if (e.target.id === 'roleModal') closeModal();
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const actionType = document.getElementById('modalActionType').value;
    const roleIdStr = document.getElementById('modalRoleId').value;
    const memberNameOrReason = document.getElementById('memberName').value.trim();
    const roleTitle = database[currentMeetingDate][roleIdStr].title;

    try {
        if (actionType === 'claim') {
            await fetch('http://localhost:5000/api/roles/allocate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ member_name: memberNameOrReason, role_name: roleTitle, meeting_date: currentMeetingDate })
            });

            database[currentMeetingDate][roleIdStr].member = memberNameOrReason;
            database[currentMeetingDate][roleIdStr].allocatePending = true;
            database[currentMeetingDate][roleIdStr].cancelPending = false;
            alert("Role requested! An email has been sent to Admin for approval.");
        } else if (actionType === 'cancel') {
            await fetch('http://localhost:5000/api/roles/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    member_name: database[currentMeetingDate][roleIdStr].member, 
                    role_name: roleTitle, 
                    meeting_date: currentMeetingDate
                })
            });

            database[currentMeetingDate][roleIdStr].cancelPending = true;
            database[currentMeetingDate][roleIdStr].cancelReason = memberNameOrReason;
            alert("Cancellation request sent! Admin must approve it via email.");
        }

        localStorage.setItem('tm_meetings_data', JSON.stringify(database));
        loadRolesForMeeting();
        closeModal();
    } catch(err) {
        console.error(err);
        alert("Could not connect to backend server. Ensure it is running by typing 'npm run dev'!");
    }
}
