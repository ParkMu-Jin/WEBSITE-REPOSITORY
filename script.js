// Variables globales
let uploadedFiles = [];
let currentTheme = 'light';

function initializeTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('input');

    body.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
    }
}

function saveTheme(theme) {
    currentTheme = theme;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // Theme toggle
    const themeToggle = document.getElementById('input');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            saveTheme(newTheme);
        });
    }

    initializeFileUpload();
    
    // Smooth scrolling para enlaces internos
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

    // Cargar archivos del repositorio después de un delay
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

// Funciones de GitHub API
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'ParkMu-Jin';
const REPO_NAME = 'KITSUNE';

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const icons = {
        'js': '📄',
        'html': '🌐',
        'css': '🎨',
        'py': '🐍',
        'java': '☕',
        'cpp': '⚙️',
        'c': '⚙️',
        'txt': '📄',
        'md': '📋',
        'json': '📊',
        'xml': '📄',
        'pdf': '📑',
        'doc': '📄',
        'docx': '📄',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'zip': '📦',
        'rar': '📦'
    };
    return icons[extension] || '📄';
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
        
        // Actualizar estadísticas si existen los elementos
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
        // Cargar información del repositorio
        const repoInfo = await fetchRepoInfo();
        
        // Cargar archivos del repositorio
        const files = await fetchRepoContents();
        
        if (!files) {
            throw new Error('No se pudieron cargar los archivos');
        }
        
        // Actualizar contador de archivos si existe
        safeElementOperation('#fileCount', (el) => {
            el.textContent = files.length;
        });
        
        // Crear grid de archivos
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

// Función auxiliar para operaciones seguras en elementos
function safeElementOperation(selector, operation) {
    const element = document.querySelector(selector);
    if (element && typeof operation === 'function') {
        return operation(element);
    }
    return null;
}