import { getDaysDiff, getTodayStr } from './dateUtils.js';
import { loadState, saveState } from './storage.js';
import { renderRoadmap } from './roadmap.js';

// Carga Inicial del Estado
let { globalTrackerStart, habits } = loadState();

// Índices de navegación de la interfaz
let currentRoadmapIndex = 0;
let viewingDateOffset = 0; // 0 = Hoy, -1 = Ayer, -2 = Anteayer, etc.

// Selectores del DOM
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const habitForm = document.getElementById('habitForm');
const todayButtonsContainer = document.getElementById('todayButtonsContainer');
const matrixHead = document.getElementById('matrixHead');
const matrixBody = document.getElementById('matrixBody');
const roadmapsContainer = document.getElementById('roadmapsContainer');

// Listeners del Modal
openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));

// Función auxiliar para calcular la fecha que se está visualizando en los botones
function getTargetDateStr() {
    const today = new Date();
    today.setDate(today.getDate() + viewingDateOffset);
    return today.toISOString().split('T')[0];
}

function updateUI() {
    const todayStr = getTodayStr();
    const targetDateStr = getTargetDateStr();

    if (habits.length === 0) {
        // Reiniciar controles si no hay hábitos
        const todayPanelHeader = document.querySelector('.today-panel h2');
        if (todayPanelHeader) todayPanelHeader.textContent = "¿Qué has cumplido hoy?";
        todayButtonsContainer.innerHTML = "<p style='color:#64748b;'>¡Crea tu primer hábito para empezar!</p>";
        matrixHead.innerHTML = ""; matrixBody.innerHTML = "<tr><td>Vacío</td></tr>";
        roadmapsContainer.innerHTML = "<p style='color:#64748b; text-align:center;'>No hay rutas de recompensas disponibles.</p>";
        return;
    }

    if (currentRoadmapIndex >= habits.length) currentRoadmapIndex = habits.length - 1;
    if (currentRoadmapIndex < 0) currentRoadmapIndex = 0;

    const totalGlobalDays = getDaysDiff(globalTrackerStart, todayStr) + 1;
    const maxPastOffset = -getDaysDiff(globalTrackerStart, todayStr);

    // 1. PANEL SUPERIOR - CONTROL DE NAVEGACIÓN TEMPORAL Y BOTONES
    const todayPanelHeader = document.querySelector('.today-panel h2');
    if (todayPanelHeader) {
        let dateLabel = "HOY";
        if (viewingDateOffset === -1) dateLabel = "AYER";
        if (viewingDateOffset < -1) dateLabel = `hace ${Math.abs(viewingDateOffset)} días (${targetDateStr})`;
        
        todayPanelHeader.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>¿Qué cumpliste el día de <strong>${dateLabel}</strong>?</span>
                <div class="roadmap-navigation" style="gap: 8px;">
                    <button class="btn-nav-roadmap" id="prevDayBtn" ${viewingDateOffset <= maxPastOffset ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>&lt;</button>
                    <button class="btn-nav-roadmap" id="nextDayBtn" ${viewingDateOffset >= 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>&gt;</button>
                </div>
            </div>
        `;

        document.getElementById('prevDayBtn').onclick = () => {
            viewingDateOffset--;
            updateUI();
        };
        document.getElementById('nextDayBtn').onclick = () => {
            if (viewingDateOffset < 0) {
                viewingDateOffset++;
                updateUI();
            }
        };
    }

    todayButtonsContainer.innerHTML = "";
    
    habits.forEach((habit) => {
        const diffWithToday = getDaysDiff(habit.createdAt, todayStr);
        // Garantizar que el historial interno crezca dinámicamente hasta el día real actual
        while (habit.history.length <= diffWithToday) habit.history.push(false);

        // Calcular en qué posición del array cae la fecha que estamos visualizando en la botonera
        const habitAgeAtTargetDate = getDaysDiff(habit.createdAt, targetDateStr);

        if (habitAgeAtTargetDate < 0) {
            // REGLA CRÍTICA: El hábito aún no existía en esta fecha histórica del tracker general
            const lockPlaceholder = document.createElement('div');
            lockPlaceholder.style.cssText = "color: #94a3b8; font-size: 13px; font-style: italic; background: #f8fafc; padding: 10px 16px; border-radius: 8px; border: 1px dashed #cbd5e1;";
            lockPlaceholder.innerHTML = `🔒 <strong>${habit.name}</strong> (No creado aún)`;
            todayButtonsContainer.appendChild(lockPlaceholder);
        } else {
            // El hábito ya existía, renderizamos su botón interactivo con el estado de ese día específico
            const isDone = habit.history[habitAgeAtTargetDate];
            const btn = document.createElement('button');
            btn.className = `btn-today-check ${isDone ? 'active' : ''}`;
            btn.innerHTML = `${habit.name} ${isDone ? '✓' : ''}`;
            
            btn.onclick = () => {
                habit.history[habitAgeAtTargetDate] = !habit.history[habitAgeAtTargetDate];
                saveState(habits, globalTrackerStart); 
                updateUI();
            };
            todayButtonsContainer.appendChild(btn);
        }
    });

    // 2. CABECERA MATRIZ
    let headRow = "<tr><th style='text-align:left;'>Hábitos</th>";
    for (let i = 1; i <= totalGlobalDays; i++) headRow += `<th>Dí${i}</th>`;
    matrixHead.innerHTML = headRow + "</tr>";

    // 3. CUERPO MATRIZ y CÁLCULO DE PUNTOS DE ESFUERZO
    matrixBody.innerHTML = "";
    let calculatedPoints = [];

    habits.forEach((habit, habitIdx) => {
        const tr = document.createElement('tr');
        const nameTd = document.createElement('td');
        nameTd.className = 'habit-name-cell';
        nameTd.innerHTML = `<span>${habit.name}</span>`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete-habit';
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => deleteHabit(habitIdx);
        nameTd.appendChild(deleteBtn);
        tr.appendChild(nameTd);

        const delayDays = getDaysDiff(globalTrackerStart, habit.createdAt);
        const relativeTodayIdx = getDaysDiff(habit.createdAt, todayStr);
        
        let processedStatuses = [];
        const maxWildcards = 7 - parseInt(habit.qty);
        let effortPoints = 0;

        // Fase 1: Mapeo preliminar de estados individuales
        for (let d = 0; d < habit.history.length; d++) {
            const isToday = (d === relativeTodayIdx);
            
            if (habit.history[d]) {
                processedStatuses.push({ completed: true, finalState: 'success', isToday });
            } else {
                if (isToday) {
                    processedStatuses.push({ completed: false, finalState: 'standby', isToday });
                } else {
                    processedStatuses.push({ completed: false, finalState: 'fail', isToday });
                }
            }
        }

        // Fase 2: Procesamiento por bloques semanales (7 días) para comodines y penalizaciones
        for (let i = 0; i < processedStatuses.length; i += 7) {
            let wildcardsUsed = 0;
            for (let j = i; j < i + 7 && j < processedStatuses.length; j++) {
                const dayNode = processedStatuses[j];

                if (dayNode.completed) {
                    dayNode.finalState = 'success';
                    effortPoints += 1;
                } else {
                    if (dayNode.finalState === 'standby') {
                        continue; 
                    }
                    if (wildcardsUsed < maxWildcards) {
                        dayNode.finalState = 'wildcard';
                        wildcardsUsed++;
                    } else {
                        dayNode.finalState = 'fail';
                        effortPoints -= 2;
                    }
                }
            }
        }

        if (effortPoints < 0) effortPoints = 0;
        calculatedPoints.push(effortPoints);

        // Dibujar las celdas en la matriz HTML
        for (let g = 0; g < totalGlobalDays; g++) {
            const td = document.createElement('td');
            const cell = document.createElement('div');
            
            if (g < delayDays) {
                cell.className = "cell-box pre-creation";
            } else {
                const localIdx = g - delayDays;
                const statusObj = processedStatuses[localIdx];
                
                if (statusObj) {
                    cell.className = statusObj.finalState === 'standby' ? 'cell-box empty' : `cell-box ${statusObj.finalState}`;
                } else {
                    cell.className = "cell-box empty";
                }
            }
            td.appendChild(cell); 
            tr.appendChild(td);
        }
        matrixBody.appendChild(tr);
    });

    // 4. RENDERIZAR EL ROADMAP CARRUSEL ÚNICO
    roadmapsContainer.innerHTML = "";
    
    const activeHabit = habits[currentRoadmapIndex];
    const activePoints = calculatedPoints[currentRoadmapIndex];

    if (activeHabit) {
        renderRoadmap(activeHabit, activePoints, roadmapsContainer);
        
        const currentCardHeader = roadmapsContainer.querySelector('.roadmap-header');
        if (currentCardHeader) {
            currentCardHeader.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <h3 style="display:flex; align-items:center; gap:8px;">
                        Ruta: ${activeHabit.name} 
                        <span style="font-size: 11px; background:#e2e8f0; color:#475569; padding:2px 8px; border-radius:12px; font-weight:normal;">
                            ${currentRoadmapIndex + 1} de ${habits.length}
                        </span>
                    </h3>
                </div>
                <div class="roadmap-navigation">
                    <span style="font-weight:bold; color:var(--primary-color); margin-right:10px;">${activePoints} ★</span>
                    <button class="btn-nav-roadmap" id="prevRoadmapBtn">&lt;</button>
                    <button class="btn-nav-roadmap" id="nextRoadmapBtn">&gt;</button>
                </div>
            `;

            document.getElementById('prevRoadmapBtn').onclick = () => {
                currentRoadmapIndex = (currentRoadmapIndex - 1 + habits.length) % habits.length;
                updateUI();
            };

            document.getElementById('nextRoadmapBtn').onclick = () => {
                currentRoadmapIndex = (currentRoadmapIndex + 1) % habits.length;
                updateUI();
            };
        }
    }
}

// Envío del formulario
habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('habitName').value.trim();
    const qty = document.getElementById('habitQty').value;
    const todayStr = getTodayStr();

    if (!globalTrackerStart) {
        globalTrackerStart = todayStr;
    }

    const rewards = {
        r3: document.getElementById('r3').value.trim(),
        r10: document.getElementById('r10').value.trim(),
        r24: document.getElementById('r24').value.trim(),
        r30: document.getElementById('r30').value.trim()
    };

    const newHabit = {
        name, qty, createdAt: todayStr, rewards, history: [false]
    };

    habits.push(newHabit);
    currentRoadmapIndex = habits.length - 1; 
    saveState(habits, globalTrackerStart);
    viewingDateOffset = 0; // Devolver la vista al día de hoy automáticamente al añadir hábitos
    updateUI();
    habitForm.reset();
    modalOverlay.classList.remove('active');
});

function deleteHabit(index) {
    if (confirm(`¿Eliminar definitivamente "${habits[index].name}"?`)) {
        habits.splice(index, 1);
        if (habits.length === 0) {
            globalTrackerStart = null;
            viewingDateOffset = 0;
        }
        saveState(habits, globalTrackerStart);
        updateUI();
    }
}

// Lanzamiento inicial de la app
updateUI();