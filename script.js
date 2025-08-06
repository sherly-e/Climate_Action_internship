document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize pledge data
    let pledges = JSON.parse(localStorage.getItem('climatePledges')) || [];
    
    // Sample data if empty
    if (pledges.length === 0) {
        pledges = [
            {
                id: 'PLEDGE1001',
                name: 'Alex Johnson',
                email: 'alex@example.com',
                phone: '5550101',
                state: 'California',
                profile: 'Student',
                commitments: ['Turn off lights when not in use', 'Walk or bike for short trips', 'Reduce single-use plastics'],
                date: '2023-06-10'
            },
            {
                id: 'PLEDGE1002',
                name: 'Maria Garcia',
                email: 'maria@example.com',
                phone: '5550102',
                state: 'New York',
                profile: 'Working Professional',
                commitments: ['Use energy-efficient appliances', 'Use public transportation weekly', 'Recycle properly'],
                date: '2023-06-11'
            },
            {
                id: 'PLEDGE1003',
                name: 'James Smith',
                email: 'james@example.com',
                phone: '5550103',
                state: 'Texas',
                profile: 'Other',
                commitments: ['Set thermostat 1°C higher in summer', 'Consider electric for next vehicle', 'Compost food waste'],
                date: '2023-06-12'
            }
        ];
        localStorage.setItem('climatePledges', JSON.stringify(pledges));
    }
    
    // Update KPIs
    function updateKPIs() {
        const totalPledges = pledges.length;
        const studentPledges = pledges.filter(p => p.profile === 'Student').length;
        const professionalPledges = pledges.filter(p => p.profile === 'Working Professional').length;
        
        document.getElementById('achieved-pledges').textContent = totalPledges.toLocaleString();
        document.getElementById('student-pledges').textContent = studentPledges.toLocaleString();
        document.getElementById('professional-pledges').textContent = professionalPledges.toLocaleString();
    }
    
    // Render pledge wall
    function renderPledgeWall(filteredPledges = pledges, page = 1) {
        const itemsPerPage = 10;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPledges = filteredPledges.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredPledges.length / itemsPerPage);
        
        const tableBody = document.getElementById('pledgeTableBody');
        tableBody.innerHTML = '';
        
        paginatedPledges.forEach(pledge => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${pledge.id}</td>
                <td>${pledge.name}</td>
                <td>${pledge.date}</td>
                <td>${pledge.state}</td>
                <td>${pledge.profile}</td>
                <td>${'⭐'.repeat(Math.min(pledge.commitments.length, 5))}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Render pagination
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                if (i === page) {
                    pageBtn.classList.add('active');
                }
                
                pageBtn.addEventListener('click', () => {
                    renderPledgeWall(filteredPledges, i);
                });
                
                pagination.appendChild(pageBtn);
            }
        }
    }
    
    // Filter pledges
    function filterPledges() {
        const profileFilter = document.getElementById('filter-profile').value;
        const stateFilter = document.getElementById('filter-state').value;
        
        let filteredPledges = pledges;
        
        if (profileFilter !== 'all') {
            filteredPledges = filteredPledges.filter(p => p.profile === profileFilter);
        }
        
        if (stateFilter !== 'all') {
            filteredPledges = filteredPledges.filter(p => p.state === stateFilter);
        }
        
        renderPledgeWall(filteredPledges);
    }
    
    // Initialize filters
    document.getElementById('filter-profile').addEventListener('change', filterPledges);
    document.getElementById('filter-state').addEventListener('change', filterPledges);
    
    // Form submission
    const pledgeForm = document.getElementById('climatePledgeForm');
    
    pledgeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate at least one commitment is selected
        const commitments = Array.from(document.querySelectorAll('input[name="commitments"]:checked')).map(c => c.value);
        if (commitments.length === 0) {
            alert('Please select at least one commitment');
            return;
        }
        
        // Create new pledge
        const newPledge = {
            id: 'PLEDGE' + (1000 + pledges.length + 1),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            state: document.getElementById('state').value,
            profile: document.querySelector('input[name="profile"]:checked').value,
            commitments: commitments,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add to pledges array
        pledges.push(newPledge);
        localStorage.setItem('climatePledges', JSON.stringify(pledges));
        
        // Update UI
        updateKPIs();
        renderPledgeWall();
        
        // Show certificate
        showCertificate(newPledge);
        
        // Reset form
        pledgeForm.reset();
    });
    
    // Show certificate
    function showCertificate(pledge) {
        document.getElementById('certificate-name').textContent = pledge.name;
        document.getElementById('certificate-date').textContent = pledge.date;
        
        const rating = document.getElementById('certificate-rating');
        rating.innerHTML = '';
        const starCount = Math.min(pledge.commitments.length, 5);
        rating.innerHTML = '⭐'.repeat(starCount);
        
        // Scroll to certificate
        document.getElementById('certificate').style.display = 'block';
        window.scrollTo({
            top: document.getElementById('certificate').offsetTop - 70,
            behavior: 'smooth'
        });
        
        // Share button
        document.getElementById('share-btn').addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Climate Action Pledge',
                    text: `I just took the climate action pledge! Join me in making a difference.`,
                    url: window.location.href.split('#')[0] + '#certificate'
                }).catch(err => {
                    console.log('Error sharing:', err);
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const shareUrl = window.location.href.split('#')[0] + '#certificate';
                const shareText = `I just took the climate action pledge! Check out my certificate: ${shareUrl}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Share link copied to clipboard!');
                }).catch(err => {
                    console.log('Could not copy text: ', err);
                    prompt('Copy this link to share:', shareUrl);
                });
            }
        });
        
        // Download button (simplified - would need more complex solution for actual image download)
        document.getElementById('download-btn').addEventListener('click', function() {
            alert('In a full implementation, this would download your certificate as an image.');
        });
    }
    
    // Initialize the app
    updateKPIs();
    renderPledgeWall();
});