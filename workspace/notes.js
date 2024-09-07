// Initialize notes from localStorage or default to an empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];
if (!Array.isArray(notes)) {
    notes = [];
    localStorage.setItem('notes', JSON.stringify(notes));
}

let currentNoteId = null;
let undoStack = [];
let redoStack = [];

// DOM elements
const notesList = document.getElementById('notesList');
const noteContent = document.getElementById('noteContent');
const addNoteBtn = document.getElementById('addNoteBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');
const shareNoteBtn = document.getElementById('shareNoteBtn');
const addTagBtn = document.getElementById('addTagBtn');
const filterByTagBtn = document.getElementById('filterByTagBtn');
const saveVersionBtn = document.getElementById('saveVersionBtn');
const fullScreenBtn = document.getElementById('fullScreenBtn');
const searchInput = document.getElementById('searchInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const lastSaved = document.getElementById('lastSaved');
const darkModeToggle = document.getElementById('darkModeToggle');
const exportBtn = document.getElementById('exportBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

// Toolbar elements
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');
const listBtn = document.getElementById('listBtn');
const colorPicker = document.getElementById('colorPicker');
const fontSelect = document.getElementById('fontSelect');

// Utility functions
function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note-item');
    noteElement.setAttribute('data-id', note.id);
    noteElement.setAttribute('draggable', true);
    noteElement.innerHTML = `
        <div class="note-title">${note.title || 'Untitled Note'}</div>
        <div class="note-preview">${note.content.replace(/<[^>]*>/g, '').substring(0, 50)}...</div>
        <div class="note-date">${new Date(note.lastModified).toLocaleString()}</div>
    `;
    noteElement.onclick = () => selectNote(note.id);
    noteElement.ondragstart = drag;
    return noteElement;
}

function renderNotesList(notesToRender = notes) {
    notesList.innerHTML = '';
    notesToRender.forEach(note => {
        notesList.appendChild(createNoteElement(note));
    });
}

function selectNote(id) {
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    if (note) {
        noteContent.innerHTML = note.content;
        document.querySelectorAll('.note-item').forEach(el => el.classList.remove('active'));
        notesList.querySelector(`[data-id="${id}"]`)?.classList.add('active');
        updateStatusBar();
    }
}

function updateStatusBar() {
    const content = noteContent.innerText || '';
    wordCount.textContent = `Words: ${content.split(/\s+/).filter(Boolean).length}`;
    charCount.textContent = `Characters: ${content.length}`;
    const note = notes.find(n => n.id === currentNoteId);
    lastSaved.textContent = note ? `Last saved: ${new Date(note.lastModified).toLocaleString()}` : 'Last saved: Never';
}

// Event Handlers
function addNote() {
    const id = Date.now().toString();
    const newNote = {
        id,
        title: 'New Note',
        content: '',
        lastModified: new Date().toISOString()
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotesList();
    selectNote(id);
}

function deleteNote() {
    if (currentNoteId === null) return;
    notes = notes.filter(note => note.id !== currentNoteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotesList();
    noteContent.innerHTML = '';
    updateStatusBar();
    currentNoteId = null;
}

function shareNote() {
    if (currentNoteId === null) return;
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        const noteURL = `${window.location.origin}/note/${note.id}`;
        prompt('Share this URL:', noteURL);
    }
}

function addTag() {
    const tag = prompt('Enter a tag for this note:');
    if (!tag || currentNoteId === null) return;
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        note.tags = note.tags || [];
        note.tags.push(tag);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotesList();
    }
}

function filterByTag() {
    const tag = prompt('Enter a tag to filter notes by:');
    if (!tag) return;
    const filteredNotes = notes.filter(note => note.tags && note.tags.includes(tag));
    renderNotesList(filteredNotes);
}

function saveNoteVersion() {
    if (currentNoteId === null) return;
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    if (noteIndex === -1) return;

    const content = noteContent.innerHTML;
    const title = content.replace(/<[^>]*>/g, '').split('\n')[0] || 'Untitled Note';

    notes[noteIndex] = {
        ...notes[noteIndex],
        content,
        title,
        lastModified: new Date().toISOString(),
        versions: (notes[noteIndex].versions || []).concat({
            timestamp: new Date().toISOString(),
            content
        })
    };

    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotesList();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Toolbar functions
function applyTextStyle(style) {
    document.execCommand(style, false, null);
}

function updateTextColor() {
    document.execCommand('foreColor', false, colorPicker.value);
}

function updateFont() {
    document.execCommand('fontName', false, fontSelect.value);
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(noteContent.innerHTML);
        noteContent.innerHTML = undoStack.pop();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(noteContent.innerHTML);
        noteContent.innerHTML = redoStack.pop();
    }
}

function exportNote() {
    if (currentNoteId === null) return;
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        const blob = new Blob([note.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title || 'Note'}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Event Listeners
addNoteBtn.addEventListener('click', addNote);
deleteNoteBtn.addEventListener('click', deleteNote);
shareNoteBtn.addEventListener('click', shareNote);
addTagBtn.addEventListener('click', addTag);
filterByTagBtn.addEventListener('click', filterByTag);
saveVersionBtn.addEventListener('click', saveNoteVersion);
fullScreenBtn.addEventListener('click', toggleFullScreen);
boldBtn.addEventListener('click', () => applyTextStyle('bold'));
italicBtn.addEventListener('click', () => applyTextStyle('italic'));
underlineBtn.addEventListener('click', () => applyTextStyle('underline'));
listBtn.addEventListener('click', () => applyTextStyle('insertUnorderedList'));
colorPicker.addEventListener('input', updateTextColor);
fontSelect.addEventListener('change', updateFont);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
exportBtn.addEventListener('click', exportNote);
darkModeToggle.addEventListener('click', toggleDarkMode);

// Initialize Dark Mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Content Editable Event Handlers
noteContent.addEventListener('input', () => {
    undoStack.push(noteContent.innerHTML);
    redoStack = [];
    updateStatusBar();
});

// Drag and Drop
function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
}

function drop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text/plain');
    const targetId = event.target.dataset.id;
    if (draggedId && targetId) {
        // Handle reordering logic if needed
    }
}

function allowDrop(event) {
    event.preventDefault();
}

// Initial Rendering
renderNotesList();
