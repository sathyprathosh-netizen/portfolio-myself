/* ============================================================
   Thokala Kumar Reddy Portfolio — main.js
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. NAVBAR & SCROLL
    ---------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    var scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        });
    }


    /* ----------------------------------------------------------
       2. REVEAL OBSERVER
    ---------------------------------------------------------- */
    function initReveal() {
        var reveals = document.querySelectorAll('.reveal');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Count-up animation for big-num children
                    var nums = entry.target.querySelectorAll('.big-num');
                    nums.forEach(function(num) { countUp(num); });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    }

    function countUp(el) {
        var fullText = el.textContent.trim();
        var numMatch = fullText.match(/^([0-9,.]+)(.*)$/);
        if(!numMatch) return;
        
        var targetVal = parseFloat(numMatch[1].replace(/,/g, ''));
        var suffix = numMatch[2] || '';
        if(isNaN(targetVal)) return;

        var duration = 2000;
        var startTime = null;

        function animate(timestamp) {
            if(!startTime) startTime = timestamp;
            var progress = timestamp - startTime;
            var easeOutExpo = function(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
            var easedProgress = easeOutExpo(Math.min(progress / duration, 1));
            
            var currentVal = targetVal * easedProgress;
            var displayVal = numMatch[1].indexOf('.') > -1 ? currentVal.toFixed(1) : Math.floor(currentVal);
            
            el.textContent = displayVal + suffix;

            if(progress < duration) {
                requestAnimationFrame(animate);
            } else {
                el.textContent = fullText;
            }
        }
        requestAnimationFrame(animate);
    }
    initReveal();

    /* ----------------------------------------------------------
       3. PERSISTENCE (LocalStorage)
    ---------------------------------------------------------- */
    var STORE_KEY = 'dnova_cms_v2';

    function loadDataObj() {
        var local = {};
        try {
            local = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
        } catch(e) {}
        
        // If local is mostly empty, use CMS_CONFIG as the absolute truth for live deployment
        if (window.CMS_CONFIG && !local.heroTitle) {
            var c = window.CMS_CONFIG;
            if (c.hero) {
                local.heroTitle = c.hero.title;
                local.heroSubtitle = c.hero.subtitle;
            }
            if (c.about) {
                local.aboutDesc = c.about.description;
                local.aboutStats = c.about.stats;
            }
            local.skills = c.skills;
            local.projects = c.projects;
            local.experience = c.experience;
            local.education = c.education;
            if (c.resume) {
                local.resumeDesc = c.resume.description;
                local.resumeLabel = c.resume.buttonText;
                local.resumeData = c.resume.fileData;
                local.resumeFileName = c.resume.fileName;
            }
            local.socials = c.socials;
            if (c.portrait) {
                local.portraitSrc = c.portrait.src;
            }
        }
        return local;
    }

    function loadSaved() {
        var data = loadDataObj();

        // Portrait
        if (data.portraitSrc) {
            var portraitImg = document.getElementById('portrait-img');
            if (portraitImg) portraitImg.src = data.portraitSrc;
        }

        if (data.heroTitle)    setInner('hero-title',   data.heroTitle);
        if (data.heroSubtitle) setInner('hero-subtitle', data.heroSubtitle);
        if (data.aboutDesc)    setInner('about-desc',   data.aboutDesc);

        // About Stats
        if(data.aboutStats && data.aboutStats.length > 0) {
            data.aboutStats.forEach((s, idx) => {
                setInner(`about-stat${idx+1}`, s.val);
                setInner(`about-stat${idx+1}-label`, s.label);
            });
        }

        if (data.skills && data.skills.length) {
            renderSkills(data.skills);
        } else if (data.skills && data.skills.length === 0) {
            renderSkills([]); // Empty state
        }
        
        if (data.projects && data.projects.length > 0) {
            renderProjects(data.projects);
        } else if (data.projects && data.projects.length === 0) {
            renderProjects([]); 
        }

        if (data.education) {
            renderTimeline('education-timeline', data.education);
        }
        
        if (data.experience) {
            renderTimeline('experience-timeline', data.experience);
        }

        updateResumeUI(data);
        updateSocialsUI(data);

        initReveal();
    }

    function updateSocialsUI(data) {
        if (!data.socials) return;
        const platforms = ['linkedin', 'github', 'leetcode', 'instagram'];
        platforms.forEach(p => {
            const el = document.getElementById('soc-' + p);
            if (el && data.socials[p]) {
                el.href = data.socials[p];
            }
        });
    }

    function updateResumeUI(data) {
        var link = document.getElementById('resume-link');
        var view = document.getElementById('resume-view');
        var desc = document.getElementById('resume-desc');
        
        if (data.resumeDesc && desc) desc.textContent = data.resumeDesc;
        if (data.resumeLabel && link) link.textContent = data.resumeLabel;

        if (data.resumeData) {
            // Download Link (Data URL is fine for downloading)
            if (link) {
                link.href = data.resumeData;
                link.download = data.resumeFileName || 'Resume.pdf';
            }
            
            // View Link (Blob URL is better for browser compatibility in new tabs)
            if (view) {
                try {
                    var blob = dataURLtoBlob(data.resumeData);
                    var url = URL.createObjectURL(blob);
                    view.href = url;
                } catch(e) {
                    console.error("View Link failed:", e);
                    view.href = data.resumeData; // Fallback
                }
            }
        }
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1].replace(/\s/g, '')), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    function setInner(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /* ----------------------------------------------------------
       4. RENDER UIs
    ---------------------------------------------------------- */
    function renderSkills(arr) {
        var grid = document.getElementById('skills-grid');
        if (!grid) return;
        if(arr.length === 0) {
            grid.innerHTML = '<p style="color:var(--muted)">No skills added yet.</p>';
            return;
        }
        grid.innerHTML = arr.map(function(s) {
            return '<span class="skill-text-chip reveal">' + escHtml(s) + '</span>';
        }).join('');
    }

    function renderProjects(arr) {
        var grid = document.getElementById('projects-grid');
        if (!grid) return;
        if(arr.length === 0) {
            grid.innerHTML = '<p style="color:var(--muted)">No projects yet.</p>';
            return;
        }
        grid.innerHTML = arr.map(function (p) {
            var imgSrc = p.img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop';
            return '<div class="project-card reveal">' +
                '<div class="project-img-wrap">' +
                    '<img src="' + escHtml(imgSrc) + '" alt="' + escHtml(p.title) + '" loading="lazy">' +
                '</div>' +
                '<div class="project-body">' +
                    '<h3>' + escHtml(p.title) + '</h3>' +
                    '<p>' + escHtml(p.desc) + '</p>' +
                    '<a href="' + escHtml(p.link || '#') + '" class="project-link" target="_blank" rel="noopener noreferrer">See Live Link →</a>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function renderTimeline(containerId, arr) {
        var tl = document.getElementById(containerId);
        if (!tl) return;
        if(!arr || arr.length === 0) {
            tl.innerHTML = '';
            tl.style.display = 'none'; // Hide if empty
            return;
        }
        tl.style.display = 'block';
        tl.innerHTML = arr.map(function (item) {
            var gradeHtml = item.grade ? '<span class="tl-grade" style="display:inline-block; margin-top:5px; padding:3px 8px; background:rgba(0,168,107,0.1); color:var(--primary); border-radius:4px; font-weight:600; font-size:0.85rem;">' + escHtml(item.grade) + '</span>' : '';
            return '<div class="timeline-item reveal">' +
                '<div class="tl-dot"></div>' +
                '<div class="tl-body">' +
                    '<span class="tl-date">' + escHtml(item.date) + '</span>' +
                    '<h3>' + escHtml(item.role) + '</h3>' +
                    '<h4>' + escHtml(item.org) + '</h4>' +
                    '<p>' + escHtml(item.desc) + '</p>' +
                    gradeHtml +
                '</div>' +
            '</div>';
        }).join('');
    }

    function escHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    loadSaved(); // Auto-load overrides immediately

    function initPortraitUpload() {
        const portraitImg = document.getElementById('portrait-img');
        const portraitInput = document.getElementById('portrait-file-input');
        
        if (portraitInput && portraitImg) {
            portraitInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        portraitImg.src = evt.target.result;
                        var data = loadDataObj();
                        data.portraitSrc = evt.target.result;
                        localStorage.setItem(STORE_KEY, JSON.stringify(data));
                        showToast('Portrait updated!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    function initResumeUpload() {
        const resumeInput = document.getElementById('f-resume-file');
        const resumeData = document.getElementById('f-resume-data');
        const resumeStatus = document.getElementById('resume-status');
        
        if (resumeInput) {
            resumeInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        resumeData.value = evt.target.result;
                        resumeInput.setAttribute('data-filename', file.name);
                        if(resumeStatus) resumeStatus.textContent = "Selected: " + file.name;
                        
                        // Lively update
                        updateResumeUI({
                            resumeData: evt.target.result,
                            resumeFileName: file.name,
                            resumeDesc: document.getElementById('f-resume-desc').value,
                            resumeLabel: document.getElementById('f-resume-label').value
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    /* ----------------------------------------------------------
       6. DOM STATE EXPORT FOR MODAL MULTI-TABS
    ---------------------------------------------------------- */
    function readSkills() {
        var textarea = document.getElementById('f-skills-text');
        if (!textarea) return [];
        return textarea.value.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s !== ''; });
    }

    function readProjects() {
        var cards = document.querySelectorAll('#projects-grid .project-card');
        var arr = [];
        cards.forEach(function (card) {
            arr.push({
                title: (card.querySelector('h3') || {}).textContent || '',
                desc:  (card.querySelector('p')  || {}).textContent || '',
                img:   (card.querySelector('img') || {}).src || '',
                link:  (card.querySelector('a')   || {}).getAttribute('href') || '#'
            });
        });
        return arr;
    }

    function readTimeline(containerId) {
        var items = document.querySelectorAll('#' + containerId + ' .timeline-item');
        var arr = [];
        items.forEach(function (item) {
            arr.push({
                date: (item.querySelector('.tl-date') || {}).textContent || '',
                role: (item.querySelector('h3')       || {}).textContent || '',
                org:  (item.querySelector('h4')       || {}).textContent || '',
                desc: (item.querySelector('p')        || {}).textContent || '',
                grade: (item.querySelector('.tl-grade') || {}).textContent || ''
            });
        });
        return arr;
    }

    /* ----------------------------------------------------------
       7. ADMIN MODAL INTERACTIONS
    ---------------------------------------------------------- */
    var adminVerified = false;
    var fabVerify = document.getElementById('fab-verify');
    var fabEdit   = document.getElementById('fab-edit');
    var modal     = document.getElementById('admin-modal');
    var modalClose = document.getElementById('modal-close');
    var btnSave   = document.getElementById('btn-save');

    if(fabVerify) {
        fabVerify.addEventListener('click', function () {
            var key = prompt('Enter Admin Key:');
            if (key === 'admin2026') {
                adminVerified = true;
                document.body.classList.add('admin-active'); // Enables the portrait upload overlay
                initPortraitUpload();
                initResumeUpload();
                fabVerify.style.display = 'none';
                fabEdit.style.display = 'flex';
                showToast('Admin Mode verified!');
            } else if (key !== null) {
                alert('Incorrect key.');
            }
        });
    }

    if(fabEdit) {
        fabEdit.addEventListener('click', function () {
            if (!adminVerified) return;
            populateModal();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeModal() {
        if(modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modal) modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // Tab swapper
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            var pane = document.getElementById(btn.dataset.tab);
            if(pane) pane.classList.add('active');
        });
    });

    /* ----------------------------------------------------------
       8. MODAL POPULATE & DYNAMIC CARDS
    ---------------------------------------------------------- */
    function populateModal() {
        // Hero
        document.getElementById('f-hero-title').value    = (document.getElementById('hero-title')    || {}).textContent || '';
        document.getElementById('f-hero-subtitle').value = (document.getElementById('hero-subtitle') || {}).textContent || '';
        document.getElementById('f-about-desc').value    = (document.getElementById('about-desc')   || {}).textContent || '';

        // About Stats
        for(let i=1; i<=3; i++) {
            const valEl = document.getElementById(`about-stat${i}`);
            const labEl = document.getElementById(`about-stat${i}-label`);
            if(valEl) document.getElementById(`f-about-stat${i}`).value = valEl.textContent;
            if(labEl) document.getElementById(`f-about-stat${i}-label`).value = labEl.textContent;
        }

        // Resume
        var data = loadDataObj();
        var resumeInput = document.getElementById('f-resume-data');
        var resumeStatus = document.getElementById('resume-status');
        
        document.getElementById('f-resume-desc').value = (document.getElementById('resume-desc') || {}).textContent || '';
        document.getElementById('f-resume-label').value = (document.getElementById('resume-link') || {}).textContent || '';

        if(resumeInput && data.resumeData) {
            resumeInput.value = data.resumeData;
            if(resumeStatus) resumeStatus.textContent = "Current File: " + (data.resumeFileName || 'resume.pdf');
        }

        // Socials
        if (data.socials) {
            document.getElementById('f-soc-linkedin').value  = data.socials.linkedin || '';
            document.getElementById('f-soc-github').value    = data.socials.github || '';
            document.getElementById('f-soc-leetcode').value  = data.socials.leetcode || '';
            document.getElementById('f-soc-instagram').value = data.socials.instagram || '';
        } else {
            // Check DOM if no data
            ['linkedin', 'github', 'leetcode', 'instagram'].forEach(p => {
                const el = document.getElementById('soc-' + p);
                if (el) document.getElementById('f-soc-' + p).value = el.getAttribute('href') !== '#' ? el.getAttribute('href') : '';
            });
        }

        // Skills
        var skillsTextarea = document.getElementById('f-skills-text');
        var data = loadDataObj();
        if(skillsTextarea) {
            skillsTextarea.value = (data.skills || readSkillsFromDOM()).join(', ');
        }

        // Projects
        var projList = document.getElementById('projects-edit-list');
        if(projList) {
            projList.innerHTML = '';
            readProjects().forEach(function (p) { addProjectCard(p); });
        }


        var eduList = document.getElementById('edu-edit-list');
        if(eduList) {
            eduList.innerHTML = '';
            readTimeline('education-timeline').forEach(function (t) { addTimelineCard('edu-edit-list', t); });
        }

        var expList = document.getElementById('exp-edit-list');
        if(expList) {
            expList.innerHTML = '';
            readTimeline('experience-timeline').forEach(function (t) { addTimelineCard('exp-edit-list', t); });
        }
    }

    function readSkillsFromDOM() {
        var chips = document.querySelectorAll('#skills-grid .skill-text-chip');
        var arr = [];
        chips.forEach(function(c) { arr.push(c.textContent.trim()); });
        return arr;
    }

    function addProjectCard(p) {
        p = p || {};
        var card = document.createElement('div');
        card.className = 'edit-card';
        card.innerHTML =
            '<button type="button" class="del-btn" aria-label="Remove">✕ Remove</button>' +
            '<div class="field-group"><label>Project Title</label>' +
            '<input type="text" class="m-input c-title" value="' + escHtml(p.title || '') + '"></div>' +
            
            '<div class="field-group"><label>Project Image Upload</label>' +
            '<label class="img-upload-btn">📷 Select Image<input type="file" class="c-file" accept="image/*" style="display:none;"></label>' +
            '<div style="margin-top:10px;"><img class="c-preview" src="' + escHtml(p.img || '') + '" style="max-height:80px; border-radius:8px; display:' + (p.img ? 'block' : 'none') + ';"></div>' +
            '<input type="hidden" class="c-img-data" value="' + escHtml(p.img || '') + '"></div>' +
            
            '<div class="field-group"><label>Project Link</label>' +
            '<input type="text" class="m-input c-link" value="' + escHtml(p.link || '#') + '"></div>' +
            
            '<div class="field-group"><label>Description</label>' +
            '<textarea class="m-input c-desc" rows="3">' + escHtml(p.desc || '') + '</textarea></div>';

        // File upload handling per project
        var fileIn = card.querySelector('.c-file');
        var preview = card.querySelector('.c-preview');
        var hiddenData = card.querySelector('.c-img-data');

        fileIn.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if(file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    preview.src = evt.target.result;
                    preview.style.display = 'block';
                    hiddenData.value = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        card.querySelector('.del-btn').addEventListener('click', function () { card.remove(); });
        document.getElementById('projects-edit-list').appendChild(card);
    }

    function addTimelineCard(listId, t) {
        t = t || {};
        var isEdu = listId === 'edu-edit-list';
        var gradeField = isEdu ? '<div class="field-group"><label>Percentage / CGPA</label><input type="text" class="m-input c-grade" value="' + escHtml(t.grade || '') + '" placeholder="e.g. 85% or 8.5 CGPA"></div>' : '';
        
        var card = document.createElement('div');
        card.className = 'edit-card';
        card.innerHTML =
            '<button type="button" class="del-btn" aria-label="Remove">✕ Remove</button>' +
            '<div class="field-group"><label>Date / Year</label>' +
            '<input type="text" class="m-input c-date" value="' + escHtml(t.date || '') + '"></div>' +
            '<div class="field-group"><label>Role / Degree</label>' +
            '<input type="text" class="m-input c-role" value="' + escHtml(t.role || '') + '"></div>' +
            '<div class="field-group"><label>Company / Institution</label>' +
            '<input type="text" class="m-input c-org" value="' + escHtml(t.org || '') + '"></div>' +
            gradeField +
            '<div class="field-group"><label>Description</label>' +
            '<textarea class="m-input c-desc" rows="3">' + escHtml(t.desc || '') + '</textarea></div>';

        card.querySelector('.del-btn').addEventListener('click', function () { card.remove(); });
        document.getElementById(listId).appendChild(card);
    }

    // Add buttons
    if(document.getElementById('add-project-btn')) document.getElementById('add-project-btn').addEventListener('click', function () { addProjectCard({}); });
    if(document.getElementById('add-edu-btn')) document.getElementById('add-edu-btn').addEventListener('click', function () { addTimelineCard('edu-edit-list', {}); });
    if(document.getElementById('add-exp-btn')) document.getElementById('add-exp-btn').addEventListener('click', function () { addTimelineCard('exp-edit-list', {}); });

    /* ----------------------------------------------------------
       9. MASTER SAVE BUTTON
    ---------------------------------------------------------- */
    if(btnSave) {
        btnSave.addEventListener('click', function () {
            var data = loadDataObj(); // Start with what's stored to keep portrait

            // Texts
            data.heroTitle = document.getElementById('f-hero-title').value.trim();
            data.heroSubtitle = document.getElementById('f-hero-subtitle').value.trim();
            data.aboutDesc = document.getElementById('f-about-desc').value.trim();

            if (data.heroTitle) setInner('hero-title', data.heroTitle);
            if (data.heroSubtitle) setInner('hero-subtitle', data.heroSubtitle);
            if (data.aboutDesc) setInner('about-desc', data.aboutDesc);

            // About Stats
            data.aboutStats = [
                { val: document.getElementById('f-about-stat1').value, label: document.getElementById('f-about-stat1-label').value },
                { val: document.getElementById('f-about-stat2').value, label: document.getElementById('f-about-stat2-label').value },
                { val: document.getElementById('f-about-stat3').value, label: document.getElementById('f-about-stat3-label').value }
            ];
            data.aboutStats.forEach((s, idx) => {
                setInner(`about-stat${idx+1}`, s.val);
                setInner(`about-stat${idx+1}-label`, s.label);
            });

            // Resume Persistence
            data.resumeDesc = document.getElementById('f-resume-desc').value.trim();
            data.resumeLabel = document.getElementById('f-resume-label').value.trim();

            if (data.resumeDesc) setInner('resume-desc', data.resumeDesc);
            if (data.resumeLabel) setInner('resume-link', data.resumeLabel);

            var rData = document.getElementById('f-resume-data').value;
            var rFile = document.getElementById('f-resume-file');
            var rName = (rFile && rFile.getAttribute('data-filename')) || data.resumeFileName || 'Resume.pdf';
            if (rData) {
                data.resumeData = rData;
                data.resumeFileName = rName;
            }
            updateResumeUI(data);

            // Socials Persistence
            data.socials = {
                linkedin:  document.getElementById('f-soc-linkedin').value.trim(),
                github:    document.getElementById('f-soc-github').value.trim(),
                leetcode:  document.getElementById('f-soc-leetcode').value.trim(),
                instagram: document.getElementById('f-soc-instagram').value.trim()
            };
            updateSocialsUI(data);

            // Skills
            data.skills = readSkills();
            renderSkills(data.skills);

            // Projects
            var projectsData = [];
            document.querySelectorAll('#projects-edit-list .edit-card').forEach(function (card) {
                projectsData.push({
                    title: (card.querySelector('.c-title') || {}).value || '',
                    img:   (card.querySelector('.c-img-data') || {}).value || '',
                    link:  (card.querySelector('.c-link') || {}).value || '#',
                    desc:  (card.querySelector('.c-desc') || {}).value || ''
                });
            });
            data.projects = projectsData;
            renderProjects(data.projects);


            // Timeline Edu
            var eduData = [];
            document.querySelectorAll('#edu-edit-list .edit-card').forEach(function (card) {
                eduData.push({
                    date: (card.querySelector('.c-date') || {}).value || '',
                    role: (card.querySelector('.c-role') || {}).value || '',
                    org:  (card.querySelector('.c-org')  || {}).value || '',
                    desc: (card.querySelector('.c-desc') || {}).value || '',
                    grade: (card.querySelector('.c-grade') || {}).value || ''
                });
            });
            data.education = eduData;
            renderTimeline('education-timeline', data.education);

            // Timeline Exp
            var expData = [];
            document.querySelectorAll('#exp-edit-list .edit-card').forEach(function (card) {
                expData.push({
                    date: (card.querySelector('.c-date') || {}).value || '',
                    role: (card.querySelector('.c-role') || {}).value || '',
                    org:  (card.querySelector('.c-org')  || {}).value || '',
                    desc: (card.querySelector('.c-desc') || {}).value || ''
                });
            });
            data.experience = expData;
            renderTimeline('experience-timeline', data.experience);

            // Persist All
            try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {
                alert('Warning: LocalStorage quota exceeded due to large image sizes. Try smaller images.');
            }

            // Sync Animations
            initReveal();
            closeModal();
            showToast('All changes saved locally!');
        });
    }

    var btnExport = document.getElementById('btn-export');
    if (btnExport) {
        btnExport.addEventListener('click', function() {
            var data = loadDataObj();
            var exportObj = {
                hero: {
                    title: data.heroTitle || (window.CMS_CONFIG && window.CMS_CONFIG.hero ? window.CMS_CONFIG.hero.title : ''),
                    subtitle: data.heroSubtitle || (window.CMS_CONFIG && window.CMS_CONFIG.hero ? window.CMS_CONFIG.hero.subtitle : '')
                },
                about: {
                    description: data.aboutDesc || '',
                    stats: data.aboutStats || []
                },
                skills: data.skills || [],
                projects: data.projects || [],
                experience: data.experience || [],
                education: data.education || [],
                resume: {
                    description: data.resumeDesc || '',
                    buttonText: data.resumeLabel || '',
                    fileData: data.resumeData || '',
                    fileName: data.resumeFileName || ''
                },
                socials: data.socials || {},
                portrait: {
                    src: data.portraitSrc || ''
                }
            };
            
            var jsContent = "/* ============================================================\n" +
                            "   Portfolio Configuration — js/config.js\n" +
                            "   ------------------------------------------------------------\n" +
                            "   This file stores your permanent portfolio data. \n" +
                            "   When you deploy to Vercel, this is what the public sees.\n" +
                            "   ============================================================ */\n\n" +
                            "const CMS_CONFIG = " + JSON.stringify(exportObj, null, 4) + ";\n\n" +
                            "window.CMS_CONFIG = CMS_CONFIG;\n";

            var blob = new Blob([jsContent], {type: "text/javascript"});
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "config.js";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("config.js downloaded! Replace your js/config.js file with this one, then push to GitHub.");
        });
    }


    /* ----------------------------------------------------------
       12. UTILS (Toast)
    ---------------------------------------------------------- */
    function showToast(msg) {
        var t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = 'position:fixed;bottom:90px;right:24px;z-index:9999;background:linear-gradient(135deg,#001F54,#0044cc);color:#fff;padding:0.75rem 1.5rem;border-radius:30px;font-size:0.9rem;font-weight:600;box-shadow:0 8px 30px rgba(0,68,204,0.5);opacity:0;transition:opacity 0.3s';
        document.body.appendChild(t);
        setTimeout(function () { t.style.opacity = '1'; }, 10);
        setTimeout(function () {
            t.style.opacity = '0';
            setTimeout(function () { t.remove(); }, 400);
        }, 3000);
    }

}());
