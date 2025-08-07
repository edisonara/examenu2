document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM - Autenticación
    const authModal = document.getElementById('authModal');
    const app = document.getElementById('app');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Elementos del DOM - Tareas
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskModal = document.getElementById('taskModal');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const closeBtn = document.querySelectorAll('.close-btn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskIdInput = document.getElementById('taskId');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Variables de estado
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Inicialización
    initApp();
    
    // Verificar si hay un token de autenticación en la URL (después de redirección OAuth)
    checkForOAuthCallback();
    
    // Funciones de autenticación
    function initApp() {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            // Verificar el token
            verifyToken(token);
        } else {
            showAuth();
        }
        
        // Configurar tabs de autenticación
        setupAuthTabs();
        
        // Configurar eventos de autenticación
        setupAuthHandlers();
    }
    
    function checkForOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const user = urlParams.get('user');
        
        if (token && user) {
            try {
                // Guardar token y usuario en localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', user);
                
                // Limpiar la URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Mostrar la aplicación
                currentUser = JSON.parse(decodeURIComponent(user));
                showApp();
                
                // Mostrar mensaje de bienvenida
                alert(`¡Bienvenido ${currentUser.name}!`);
            } catch (error) {
                console.error('Error procesando la autenticación OAuth:', error);
                alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
                showAuth();
            }
        }
    }
    
    function verifyToken(token) {
        // En una aplicación real, aquí harías una petición al servidor para verificar el token
        try {
            // Verificar el token localmente (solo para desarrollo)
            // En producción, deberías hacer una petición al servidor
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                currentUser = user;
                showApp();
            } else {
                throw new Error('No se encontró la información del usuario');
            }
        } catch (error) {
            console.error('Error al verificar el token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showAuth();
        }
    }
    
    function setupAuthTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                
                // Actualizar botones de pestaña
                tabButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Mostrar contenido de la pestaña
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}Tab`).classList.add('active');
            });
        });
    }
    
    function setupAuthHandlers() {
        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });
        
        // Cerrar modal de autenticación
        closeBtn.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target === btn || e.target.classList.contains('close-btn')) {
                    authModal.classList.remove('active');
                }
            });
        });
        
        // Cerrar sesión
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Mostrar modal de autenticación al hacer clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Aquí iría la lógica de autenticación con el backend
        console.log('Iniciando sesión con:', { email, password });
        
        // Simulación de autenticación exitosa
        // En un caso real, esto vendría de la respuesta del servidor
        const mockUser = {
            id: '123',
            name: 'Usuario de Prueba',
            email: email,
            token: 'mock-jwt-token'
        };
        
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        currentUser = mockUser;
        
        // Mostrar la aplicación
        showApp();
        
        // Cerrar el modal de autenticación
        authModal.classList.remove('active');
        
        // Mostrar mensaje de bienvenida
        alert(`¡Bienvenido de nuevo, ${mockUser.name}!`);
    }
    
    function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validar contraseñas coincidentes
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Aquí iría la lógica de registro con el backend
        console.log('Registrando usuario:', { name, email, password });
        
        // Simulación de registro exitoso
        // En un caso real, esto vendría de la respuesta del servidor
        const mockUser = {
            id: '123',
            name: name,
            email: email,
            token: 'mock-jwt-token'
        };
        
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        currentUser = mockUser;
        
        // Mostrar la aplicación
        showApp();
        
        // Cerrar el modal de autenticación
        authModal.classList.remove('active');
        
        // Mostrar mensaje de bienvenida
        alert(`¡Bienvenido a Task Manager, ${name}!`);
    }
    
    function handleLogout() {
        // Hacer una petición al servidor para cerrar sesión
        fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Importante para enviar cookies
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Limpiar el almacenamiento local
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            currentUser = null;
            
            // Limpiar tareas
            tasks = [];
            saveTasks();
            
            // Mostrar el formulario de autenticación
            showAuth();
            
            // Mostrar mensaje
            alert('Has cerrado sesión correctamente');
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            // Limpiar el almacenamiento local de todos modos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            currentUser = null;
            showAuth();
        });
    }
    
    function showApp() {
        authModal.style.display = 'none';
        app.style.display = 'block';
        
        // Actualizar la interfaz con la información del usuario
        if (currentUser) {
            const userGreeting = document.getElementById('userGreeting');
            if (userGreeting) {
                userGreeting.textContent = `Hola, ${currentUser.name}`;
            }
        }
        
        // Cargar tareas del usuario actual
        loadUserTasks();
    }
    
    function showAuth() {
        authModal.style.display = 'flex';
        app.style.display = 'none';
        
        // Limpiar formularios
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
    }
    
    function loadUserTasks() {
        // En una aplicación real, aquí harías una petición al servidor
        // para obtener las tareas del usuario actual
        const userTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser?.id}`)) || [];
        tasks = userTasks;
        renderTasks();
    }
    
    function saveUserTasks() {
        if (currentUser) {
            localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    // Event Listeners - Autenticación
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Event Listeners - Tareas
    if (addTaskBtn) addTaskBtn.addEventListener('click', () => openModal());
    if (taskForm) taskForm.addEventListener('submit', handleSubmit);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            // Actualizar filtro actual
            currentFilter = button.dataset.filter;
            // Filtrar tareas
            renderTasks();
        });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeModal();
        }
    });

    // Funciones
    function openModal(task = null) {
        if (task) {
            // Modo edición
            modalTitle.textContent = 'Editar Tarea';
            taskIdInput.value = task.id;
            taskTitleInput.value = task.title;
            taskDescriptionInput.value = task.description || '';
        } else {
            // Modo nueva tarea
            modalTitle.textContent = 'Nueva Tarea';
            taskForm.reset();
            taskIdInput.value = '';
        }
        taskModal.classList.add('active');
        taskTitleInput.focus();
    }

    function closeModal() {
        taskModal.classList.remove('active');
        taskForm.reset();
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const taskId = taskIdInput.value;
        
        if (!title) return;
        
        if (taskId) {
            // Actualizar tarea existente
            tasks = tasks.map(task => 
                task.id === taskId 
                    ? { ...task, title, description } 
                    : task
            );
        } else {
            // Crear nueva tarea
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                completed: false,
                createdAt: new Date().toISOString()
            };
            tasks.unshift(newTask);
        }
        
        saveTasks();
        renderTasks();
        closeModal();
    }

    function renderTasks() {
        // Filtrar tareas según el filtro actual
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // 'all'
        });
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No hay tareas para mostrar.</p>';
            return;
        }
        
        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item" data-id="${task.id}">
                <div class="task-info">
                    <div class="task-title ${task.completed ? 'completed' : ''}">
                        <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}" 
                           onclick="toggleTaskStatus('${task.id}')"></i>
                        ${task.title}
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn btn-sm" onclick="editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm" onclick="deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }

    function saveTasks() {
        saveUserTasks();
    }

    // Funciones globales para los botones de las tareas
    window.toggleTaskStatus = (taskId) => {
        tasks = tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed } 
                : task
        );
        saveTasks();
        renderTasks();
    };

    window.editTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            openModal(task);
        }
    };

    window.deleteTask = (taskId) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    };

    // No renderizar tareas aquí, se hará después de la autenticación
});
