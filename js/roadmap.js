export function renderRoadmap(habit, currentScore, roadmapsContainer) {
    const card = document.createElement('div');
    card.className = 'roadmap-card';

    const header = document.createElement('div');
    header.className = 'roadmap-header';
    header.innerHTML = `<h3>Ruta: ${habit.name}</h3> <span style="font-weight:bold; color:var(--primary-color);">Puntos de Esfuerzo: ${currentScore} ★</span>`;
    card.appendChild(header);

    const trackContainer = document.createElement('div');
    trackContainer.className = 'roadmap-track-container';

    const line = document.createElement('div');
    line.className = 'roadmap-line';

    const mapLength = Math.max(35, currentScore + 6);
    
    const flagMilestones = {
        3: habit.rewards.r3 || "☕ Café especial / 2 episodios de tu serie",
        10: habit.rewards.r10 || "🍕 Cena favorita / Comprar libro deseado",
        24: habit.rewards.r24 || "💆 Día libre de deberes / Masaje de capricho",
        54: habit.rewards.r30 || "💰 Hucha de Maestría mensual (+50€ para viajes)",
        84: habit.rewards.r30 || "💰 Hucha de Maestría mensual nivel 2 (+100€ para viajes)"
    };

    for (let step = 1; step <= mapLength; step++) {
        const node = document.createElement('div');
        const isFlag = flagMilestones[step] !== undefined;

        if (isFlag) {
            node.className = `roadmap-step flag-node ${currentScore >= step ? 'unlocked' : ''}`;
            node.innerHTML = `🚩<span class="reward-tooltip"><strong>Día ${step}:</strong> ${flagMilestones[step]} ${currentScore >= step ? '🔓 ¡LOGRADO!' : '🔒'}</span>`;
        } else {
            node.className = `roadmap-step ${currentScore >= step ? 'passed' : ''} ${currentScore === step ? 'current' : ''}`;
            node.textContent = step;
        }

        line.appendChild(node);

        if (step < mapLength) {
            const conn = document.createElement('div');
            conn.className = `roadmap-connection ${currentScore >= step + 1 ? 'passed' : ''}`;
            line.appendChild(conn);
        }
    }

    trackContainer.appendChild(line);
    card.appendChild(trackContainer);
    roadmapsContainer.appendChild(card);
}