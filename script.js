let uploadedFiles = [];
let currentTheme = 'light';

function initializeTheme() {
    const savedTheme = getSavedTheme() || 'light';
    currentTheme = savedTheme;
    
    const body = document.body;
    const themeToggle = document.getElementById('input');

    body.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
    }
}

function getSavedTheme() {
    try
     {
        return sessionStorage.getItem('theme');
    } catch (e) 
    {
        return currentTheme;
    }
}

function saveTheme(theme) {
    currentTheme = theme;
    try {
        sessionStorage.setItem('theme', theme);
    } catch (e) {
        console.log('SessionStorage no disponible, usando solo variable local');
    }
}

document.addEventListener('DOMContentLoaded', function() 
{
    initializeTheme();
  
    const themeToggle = document.getElementById('input');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            saveTheme(newTheme);
        });
    }

    initializeFileUpload();

    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    setTimeout(() => {
        loadRepositoryFiles();
    }, 1000);
});

window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    }

    handleResize();
});

function showZona(zonaId) {
    const zonas = document.querySelectorAll('.zona');
    zonas.forEach(zona => {
        zona.classList.remove('active');
    });
    const targetZona = document.getElementById(zonaId);
    if (targetZona) {
        targetZona.classList.add('active');
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function handleResize() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        if (window.innerWidth <= 768) {
            mobileToggle.style.display = 'block';
            navLinks.classList.remove('active');
        } else {
            mobileToggle.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('active');
        }
    }
}

window.addEventListener('resize', handleResize);

function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadArea = document.querySelector('.upload-area');

    if (fileInput && fileList && uploadArea) {
        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.background = 'rgba(93, 63, 211, 0.2)';
        });

        uploadArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.style.background = '';
        });

        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.background = '';
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });

        fileInput.addEventListener('change', function () {
            const files = Array.from(this.files);
            handleFiles(files);
        });

        renderFileList();
    }
}

function handleFiles(files) {
    files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`);
            return;
        }
        
        const fileData = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toLocaleDateString()
        };
        uploadedFiles.push(fileData);
    });

    renderFileList();
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;

    fileList.innerHTML = '';

    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No hay archivos subidos aún</p>';
        return;
    }

    uploadedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div>
                <strong>${file.name}</strong>
                <br>
                <small>${(file.size / 1024 / 1024).toFixed(2)} MB - ${file.uploadDate}</small>
            </div>
            <button class="delete-btn" onclick="deleteFile('${file.id}')">Eliminar</button>
        `;
        fileList.appendChild(fileItem);
    });
}

function deleteFile(fileId) {
    uploadedFiles = uploadedFiles.filter(file => file.id != fileId);
    renderFileList();
}

//  GitHub API
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'ParkMu-Jin';
const REPO_NAME = 'KITSUNE';

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconSize = 20; // Tamaño más apropiado para las cards
    
    const icons = {
        'js': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/javascript.png" alt="javascript"/>`,
        'ts': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/typescript.png" alt="typescript"/>`,
        'jsx': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/react-native.png" alt="react"/>`,
        'tsx': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/react-native.png" alt="react"/>`,
        'py': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/python.png" alt="python"/>`,
        'java': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/java-coffee-cup-logo.png" alt="java"/>`,
        'cpp': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/c-plus-plus-logo.png" alt="cpp"/>`,
        'c': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/c-programming.png" alt="c"/>`,
        'cs': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/c-sharp-logo.png" alt="csharp"/>`,
        'php': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/php-logo.png" alt="php"/>`,
        'rb': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/ruby-programming-language.png" alt="ruby"/>`,
        'go': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/golang.png" alt="golang"/>`,
        'swift': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/swift.png" alt="swift"/>`,
        'kt': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/kotlin.png" alt="kotlin"/>`,
        
        'html': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/html-5.png" alt="html"/>`,
        'htm': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/html-5.png" alt="html"/>`,
        'css': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/css3.png" alt="css"/>`,
        'scss': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/sass.png" alt="sass"/>`,
        'sass': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/sass.png" alt="sass"/>`,
        
        'json': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/json.png" alt="json"/>`,
        'xml': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/xml-file.png" alt="xml"/>`,
        'yaml': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/settings-file.png" alt="yaml"/>`,
        'yml': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/settings-file.png" alt="yaml"/>`,
        
        'md': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/markdown.png" alt="markdown"/>`,
        'txt': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/txt.png" alt="text"/>`,
        'pdf': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/pdf.png" alt="pdf"/>`,
        'doc': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/word.png" alt="word"/>`,
        'docx': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/word.png" alt="word"/>`,
        
        'jpg': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/jpg.png" alt="image"/>`,
        'jpeg': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/jpg.png" alt="image"/>`,
        'png': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/png.png" alt="image"/>`,
        'gif': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/gif.png" alt="gif"/>`,
        'svg': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/svg.png" alt="svg"/>`,

        'mp3': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/mp3.png" alt="audio"/>`,
        'mp4': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/mp4.png" alt="video"/>`,
        
        'zip': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/zip.png" alt="zip"/>`,
        'rar': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/rar.png" alt="rar"/>`,
        
        'sql': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/sql.png" alt="database"/>`,
        'db': `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/database.png" alt="database"/>`,
    };
    
    const fileName_lower = fileName.toLowerCase();
    if (fileName_lower.includes('readme')) return `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/markdown.png" alt="readme"/>`;
    if (fileName_lower.includes('license')) return `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/certificate.png" alt="license"/>`;
    if (fileName_lower.includes('dockerfile')) return `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/docker.png" alt="docker"/>`;
    if (fileName_lower.includes('makefile')) return `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/settings-file.png" alt="makefile"/>`;
    if (fileName_lower.includes('.gitignore')) return `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/git.png" alt="git"/>`;
    if (fileName_lower.includes('package.json')) return `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/npm.png" alt="npm"/>`;
    
    return icons[extension] || `<img width="${iconSize}" height="${iconSize}" src="https://img.icons8.com/ios-filled/${iconSize}/file.png" alt="file"/>`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

async function fetchRepoInfo() {
    try {
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}`);
        if (!response.ok) throw new Error('Error al obtener información del repositorio');
        
        const repo = await response.json();
        
        safeElementOperation('#lastUpdate', (el) => {
            el.textContent = formatDate(repo.updated_at);
        });
        safeElementOperation('#repoSize', (el) => {
            el.textContent = formatFileSize(repo.size * 1024);
        });
        
        return repo;
    } catch (error) {
        console.error('Error fetching repo info:', error);
        return null;
    }
}

async function fetchRepoContents() {
    try {
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents`);
        if (!response.ok) throw new Error('Error al obtener contenidos del repositorio');
        
        const contents = await response.json();
        return contents.filter(item => item.type === 'file');
    } catch (error) {
        console.error('Error fetching repo contents:', error);
        return null;
    }
}

function createFileCard(file) {
    return `
        <div class="file-card" onclick="window.open('${file.html_url}', '_blank')">
            <div class="file-header">
                <div class="file-icon">${getFileIcon(file.name)}</div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <div class="file-meta">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="file-description">
                Archivo del repositorio KITSUNE
            </div>
            <div class="file-actions">
                <a href="${file.html_url}" target="_blank" class="btn-small btn-primary" onclick="event.stopPropagation()">Ver código</a>
                <a href="${file.download_url}" target="_blank" class="btn-small btn-secondary" onclick="event.stopPropagation()">Descargar</a>
            </div>
        </div>
    `;
}

async function loadRepositoryFiles() {
    const container = document.getElementById('filesContainer');
    if (!container) return;
    
    try {
        const repoInfo = await fetchRepoInfo();
        
        const files = await fetchRepoContents();
        
        if (!files) {
            throw new Error('No se pudieron cargar los archivos');
        }
        
        safeElementOperation('#fileCount', (el) => {
            el.textContent = files.length;
        });
        
        const filesGrid = files.map(file => createFileCard(file)).join('');
        
        container.innerHTML = `
            <div class="files-grid">
                ${filesGrid}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading repository files:', error);
        container.innerHTML = `
            <div class="error">
                <h3>☕ El administrador no está chambeando...</h3>
                <p>¡Dale café! Los archivos del repositorio están tomando una siesta. Inténtalo de nuevo en un momento.</p>
                <button onclick="loadRepositoryFiles()" class="btn-small btn-primary" style="margin-top: 15px;">
                    Dale café ☕
                </button>
            </div>
        `;
    }
}

function safeElementOperation(selector, operation) {
    const element = document.querySelector(selector);
    if (element && typeof operation === 'function') {
        return operation(element);
    }
    return null;
}