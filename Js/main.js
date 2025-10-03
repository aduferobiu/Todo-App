 // Tiny helper to generate unique ids
    function uid() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
    }

    // Local storage key
    const STORAGE_KEY = 'simple_todo_v1';

    // State
    let tasks = []; // each: { id, text, completed }

    // Elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const listEl = document.getElementById('list');
    const countEl = document.getElementById('count');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const clearAllBtn = document.getElementById('clearAll');

    // Load saved tasks
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        tasks = raw ? JSON.parse(raw) : [];
      } catch(e) {
        tasks = [];
      }
    }

    // Save tasks
    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // Render all tasks
    function render() {
      listEl.innerHTML = '';
      if (tasks.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = 'No tasks yet. Add your first task above.';
        listEl.appendChild(empty);
        countEl.textContent = '0 tasks';
        return;
      }

      tasks.forEach(task => {
        const row = document.createElement('div');
        row.className = 'task' + (task.completed ? ' completed' : '');
        row.setAttribute('data-id', task.id);

        // checkbox
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!task.completed;
        cb.setAttribute('aria-label', 'Mark task completed');
        cb.addEventListener('change', () => toggleComplete(task.id));

        // label (or input when editing)
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = task.text;
        label.tabIndex = 0;
        label.title = 'Double click to edit';
        // allow editing by double click or Enter when focused
        label.addEventListener('dblclick', () => startEdit(task.id));
        label.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') startEdit(task.id);
        });

        // actions
        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'small-btn';
        editBtn.type = 'button';
        editBtn.title = 'Edit';
        editBtn.innerText = 'Edit';
        editBtn.addEventListener('click', () => startEdit(task.id));

        const delBtn = document.createElement('button');
        delBtn.className = 'small-btn';
        delBtn.type = 'button';
        delBtn.title = 'Delete';
        delBtn.innerText = 'Delete';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        row.appendChild(cb);
        row.appendChild(label);
        row.appendChild(actions);
        listEl.appendChild(row);
      });

      updateCounts();
    }

    // Update counts in footer
    function updateCounts() {
      const total = tasks.length;
      const remaining = tasks.filter(t => !t.completed).length;
      countEl.textContent = total + (total === 1 ? ' task' : ' tasks') + ' · ' + remaining + ' open';
    }

    // Add task
    function addTask(text) {
      const trimmed = text.trim();
      if (!trimmed) return;
      const t = { id: uid(), text: trimmed, completed: false };
      tasks.unshift(t); // newest first
      save();
      render();
    }

    // Delete task
    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }

    // Toggle completed
    function toggleComplete(id) {
      const t = tasks.find(x => x.id === id);
      if (!t) return;
      t.completed = !t.completed;
      save();
      render();
    }

    // Clear completed
    function clearCompleted() {
      tasks = tasks.filter(t => !t.completed);
      save();
      render();
    }

    // Delete all
    function clearAll() {
      if (!confirm('Delete all tasks?')) return;
      tasks = [];
      save();
      render();
    }

    // Start editing a task in place
    function startEdit(id) {
      const row = listEl.querySelector(`[data-id="${id}"]`);
      if (!row) return;
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      // replace label with input
      const label = row.querySelector('.label');
      const input = document.createElement('input');
      input.className = 'edit-input';
      input.type = 'text';
      input.value = task.text;
      input.setAttribute('aria-label', 'Edit task');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit(id, input.value);
        else if (e.key === 'Escape') render(); // cancel
      });
      input.addEventListener('blur', () => finishEdit(id, input.value));

      label.replaceWith(input);
      input.focus();
      // move caret to end
      const val = input.value;
      input.value = '';
      input.value = val;
    }

    // Finish editing, save if not empty
    function finishEdit(id, newText) {
      const trimmed = String(newText || '').trim();
      if (!trimmed) {
        // if emptied, remove the task
        deleteTask(id);
        return;
      }
      const t = tasks.find(x => x.id === id);
      if (!t) return;
      t.text = trimmed;
      save();
      render();
    }

    // Wire up UI events
    addBtn.addEventListener('click', () => {
      addTask(taskInput.value);
      taskInput.value = '';
      taskInput.focus();
    });

    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addTask(taskInput.value);
        taskInput.value = '';
      }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);

    // Initial load
    load();
    render();

    // For convenience: expose small API on window for dev console
    window.todoApp = {
      getTasks: () => tasks.slice(),
      add: addTask,
      clearCompleted,
      clearAll
    };