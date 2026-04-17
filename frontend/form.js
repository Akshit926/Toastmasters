const textareas = document.querySelectorAll("textarea");

textareas.forEach(function(textarea){
    const counter = textarea.parentElement.querySelector(".counter");
    const max = textarea.getAttribute("maxlength");
    textarea.addEventListener("input", function(){
        const length = textarea.value.length;
        counter.textContent = length + "/" + max;
    });
});

const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let fullName = document.getElementById('fullName').value.trim();
        const spaceIndex = fullName.indexOf(' ');
        const first_name = spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
        const last_name = spaceIndex !== -1 ? fullName.substring(spaceIndex + 1).trim() : 'Unknown';

        const data = {
            first_name,
            last_name,
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            introduction: document.getElementById('intro').value.trim(),
            why_join: document.getElementById('whyJoin').value.trim(),
            source: document.getElementById('source').value.trim(),
            preferred_role: document.getElementById('role').value.trim(),
            queries: document.getElementById('queries').value.trim()
        };

        try {
            const response = await fetch('http://localhost:5001/api/members/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Member registered successfully! All data securely stored.');
                form.reset();
                document.querySelectorAll('.counter').forEach(c => c.textContent = '0');
            } else {
                const err = await response.json();
                alert('Error: ' + (err.error || 'Registration failed.'));
            }
        } catch (err) {
            console.error(err);
            alert('Backend not reachable! Ensure the backend is running with "npm run dev".');
        }
    });
}